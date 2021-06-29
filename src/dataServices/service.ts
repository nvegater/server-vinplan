import {Service} from "../entities/Service";
import {getConnection, Not} from "typeorm";
import {SQL_QUERY_SELECT_PAGINATED_EXPERIENCES_WITH_CURSOR,
    SQL_QUERY_SELECT_PAGINATED_EXPERIENCES} from "../resolvers/Universal/queries";
import {UpdateServiceInputs} from "../resolvers/Service/serviceResolversInputs";

const experiencesWithCursor = async (realLimit: number, cursor : string) => {
    const replacements: any = [realLimit + 1, new Date(cursor)];
    return await getConnection().query(SQL_QUERY_SELECT_PAGINATED_EXPERIENCES_WITH_CURSOR, replacements);
}

const experiences = async (realLimit: number) => {
    const replacements: any = [realLimit + 1];
    return await getConnection().query(SQL_QUERY_SELECT_PAGINATED_EXPERIENCES, replacements);
}

const findServiceNotMadeByCreatorByServiceAndCreatorId = async (serviceId:number, userId:number) => {
    return await Service.findOne({
        where: {id: serviceId, creatorId: Not(userId)} // creator cant book its own service
    })
}

const findServicesByIds = async (serviceIds: number[]):Promise<Service[]> => {
    return await Service.findByIds(serviceIds, {relations: ["winery"]})
}


const findServiceByParentIdAndStartDateTime = async (serviceId:number, startDateTime: Date) => {
    return await Service.findOne({
        where: {parentServiceId: serviceId, startDateTime: startDateTime}
    })
}

const updateAttendeesByIdAndCreator = async (id:number, creatorId: number, noOfAttendees: number, noOfAttendeesService: number) => {
    return await getConnection().createQueryBuilder()
        .update(Service)
        .set({
            noOfAttendees: noOfAttendees + noOfAttendeesService
        })
        .where('id = :id and "creatorId" = :creatorId', {id: id, creatorId: creatorId})
        .returning("*")
        .execute();
}

const updateService = async (updateServiceInputs:UpdateServiceInputs, userId: number):Promise<Service | null> => {
    const updateInputs = {...updateServiceInputs}
    const updateResult = await getConnection().createQueryBuilder()
        .update(Service)
        .set({
            title : updateInputs.title,
            description : updateInputs.description,
            eventType : updateInputs.eventType,
            pricePerPersonInDollars : updateInputs.pricePerPersonInDollars,
            startDateTime : updateInputs.startDateTime,
            endDateTime : updateInputs.endDateTime,
            limitOfAttendees : updateInputs.limitOfAttendees,
            rRules : updateInputs.rRules
        })
        .where('id = :id and "creatorId" = :creatorId', {id: updateInputs.id, creatorId: userId})
        .returning("*")
        .execute();

    if (updateResult.affected === 0)
        return null;

    return updateResult.raw[0];
}

const findServicesByWinery = async (wineryId : number) => {
    return await Service.find({where: {wineryId: wineryId}})
}

const findServiceById = async (serviceId:number) => {
    return await Service.findOne(serviceId)
}

export default {
    experiencesWithCursor, 
    experiences,
    findServiceNotMadeByCreatorByServiceAndCreatorId,
    findServiceByParentIdAndStartDateTime,
    updateAttendeesByIdAndCreator,
    findServicesByWinery,
    findServiceById,
    findServicesByIds,
    updateService
    // getAllService,
}