import {Service} from "../../entities/Service";
import {CreateServiceInputs} from "../../resolvers/Service/serviceResolversInputs";
import {CreateServiceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import {FieldError} from "../../resolvers/User/userResolversOutputs";

const createService = async (createServiceInputs: CreateServiceInputs, userId : number): Promise<CreateServiceResponse> => {
    try {
        const service = await Service.findOne({where: {title: createServiceInputs.title}});
        if (!service) {
            try {
                const serviceCreated = await Service.create({
                    ...createServiceInputs,
                    creatorId: userId,
                    duration: createServiceInputs.duration,
                    noOfAttendees: 0,
                }).save();
                return {service: serviceCreated};
            } catch (e) {
                console.log("Error creating service", e);
                const error: FieldError = {
                    field: "title",
                    message: "Error creating service"
                }
                return { errors: [error]}
            }
        } else {
            const error: FieldError = {
                field: "createService",
                message: "Service with that title already exists"
            }
            return {errors: [error]}
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default createService;