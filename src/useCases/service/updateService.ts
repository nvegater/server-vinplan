import dataServices from "../../dataServices/service";
import {UpdateServiceInputs} from "../../resolvers/Service/serviceResolversInputs";
import {UpdateServiceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import {FieldError} from "../../resolvers/User/userResolversOutputs";

const getServices = async (updateServiceInputs: UpdateServiceInputs, userId : number): Promise<UpdateServiceResponse> => {
    try {
        const updateService = dataServices.updateService(updateServiceInputs, userId);
        if (updateService == undefined) {
            const error: FieldError = {
                field: "updateService",
                message: "no change was made"
            }
            return {errors: [error]}
        }else{
            return {service : true};
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices; 