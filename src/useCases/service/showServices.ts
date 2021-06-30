import {PaginatedExperiences} from "../../resolvers/Service/serviceResolversOutputs";
import {Service, EventType} from "../../entities/Service";
import services from "../../dataServices/service"

const getServices = async (limit: number, cursor : string | null, experienceName : string | null, eventType : EventType | null): Promise<PaginatedExperiences> => {
    try {
        const realLimit = Math.min(50, limit);
        let paginatedServicesDB: Service[];

        if (cursor) {
            paginatedServicesDB = await services.experiencesWithCursor(limit, cursor, experienceName, eventType);
        } else {
            paginatedServicesDB = await services.experiences(limit);
        }
        return {
            experiences: paginatedServicesDB.slice(0, realLimit),
            moreExperiencesAvailable: paginatedServicesDB.length === (realLimit + 1) // DB has more posts than requested
        };
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;