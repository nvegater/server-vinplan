import {Service} from "../../entities/Service";
import {getConnection, UpdateResult} from "typeorm";
import {UpdateServiceInputs} from "../../resolvers/Service/serviceResolversInputs";
import {CreateServiceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import {FieldError} from "../../resolvers/User/userResolversOutputs";

const getServices = async (updateServiceInputs: UpdateServiceInputs, userId : number): Promise<CreateServiceResponse> => {
    try {
        const {
            title, id,
            description,
            eventType,
            pricePerPersonInDollars,
            startDateTime, endDateTime
        } = updateServiceInputs;
        const updateService: UpdateResult = await getConnection().createQueryBuilder()
            .update(Service)
            .set({
                title,
                description,
                eventType,
                pricePerPersonInDollars,
                startDateTime,
                endDateTime
            })
            .where('id = :id and "creatorId" = :creatorId', {id, creatorId: userId})
            .returning("*")
            .execute();
        if (updateService.affected === 0) {
            const error: FieldError = {
                field: "updateService",
                message: "no change was made"
            }
            return {errors: [error]}
        }
        return {service: updateService.raw[0] as Service};
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;