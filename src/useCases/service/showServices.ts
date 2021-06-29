import {PaginatedExperiences} from "../../resolvers/Service/serviceResolversOutputs";
import {Service} from "../../entities/Service"
import services from "../../dataServices/service"

const getServices = async (limit: number, cursor : string | null, userId: number): Promise<PaginatedExperiences> => {
    try {
        const realLimit = Math.min(50, limit);
        let paginatedServicesDB: Service[];

        if (cursor) {
            if (userId) {
                paginatedServicesDB = await services.experiencesWithCursorUserLogged(limit, userId, cursor);
            } else {
                paginatedServicesDB = await services.experiencesWithCursor(limit, cursor);
            }
        } else {
            if (userId) {
                paginatedServicesDB = await services.experiencesUserLogged(limit, userId);
            } else {
                paginatedServicesDB = paginatedServicesDB = await services.experiences(limit);
            }
        }
        return {
            paginatedServices: paginatedServicesDB.slice(0, realLimit),
                moreServicesAvailable: paginatedServicesDB.length === (realLimit + 1) // DB has more posts than requested
        };
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;