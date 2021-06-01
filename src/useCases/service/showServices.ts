import {getConnection} from "typeorm";
import {SQL_QUERY_SELECT_SERVICES_WITH_WINERY} from "../../resolvers/Universal/queries";
import {ServiceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import {FieldError} from "../../resolvers/User/userResolversOutputs";

const getServices = async (limit: number): Promise<ServiceResponse> => {
    try {
        const realLimit = Math.min(50, limit);
        const replacements = [realLimit + 1]
        const paginatedServicesDB = await getConnection()
            .query(SQL_QUERY_SELECT_SERVICES_WITH_WINERY, replacements);

        if (paginatedServicesDB !== undefined) {
            return {
                paginatedServices: paginatedServicesDB.slice(0, realLimit),
                moreServicesAvailable: paginatedServicesDB.length === (realLimit + 1) // DB has more posts than requested
            };
        } else {
            const fieldError: FieldError = {
                field: "allServices",
                message: "All allServices finding returns undefined"
            }
            return {
                errors: [fieldError],
                moreServicesAvailable: false
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;