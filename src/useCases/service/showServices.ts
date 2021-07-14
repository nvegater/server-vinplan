import {PaginatedExperiences} from "../../resolvers/Service/serviceResolversOutputs";
import {Service, EventType} from "../../entities/Service";
import {Valley} from "../../entities/Winery";
import services from "../../dataServices/service";
import wineryServices from "../../dataServices/winery";
import getImageCover from "../../utils/getImageCover";
import {convertDateToUTC} from "../../utils/dateUtils";

const getServices = async (
    limit: number, 
    cursor : string | null, 
    experienceName : string | null, 
    eventType : EventType[] | null,
    valley: Valley[] | null,
    state: string | null
    ): Promise<PaginatedExperiences> => {
    try {
        const realLimit = Math.min(50, limit);
        let paginatedServicesDB: Service[] = await services.experiencesWithCursor(limit, cursor, experienceName, eventType, valley, state);

        for(let i = 0; i < paginatedServicesDB.length; i++) {
            paginatedServicesDB[i].startDateTime = convertDateToUTC(paginatedServicesDB[i].startDateTime);
            paginatedServicesDB[i].endDateTime = convertDateToUTC(paginatedServicesDB[i].endDateTime);
            paginatedServicesDB[i].urlImageCover = await getImageCover.experience(paginatedServicesDB[i])
            const wineryFound = await wineryServices.findWineryById(paginatedServicesDB[i].wineryId);
            if (wineryFound) {
                paginatedServicesDB[i].winery = wineryFound;
            }
        }
        
        return {
            experiences: paginatedServicesDB.slice(0, realLimit),
            moreExperiencesAvailable: paginatedServicesDB.length === (realLimit + 1), // DB has more posts than requested
            totalExperiences: paginatedServicesDB.length
        };
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;