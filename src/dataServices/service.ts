import {Service, EventType} from "../entities/Service";
import {Valley} from "../entities/Winery";
import {getConnection, Not, getRepository} from "typeorm";
import {SQL_QUERY_SELECT_PAGINATED_EXPERIENCES} from "../resolvers/Universal/queries";
import {UpdateServiceInputs} from "../resolvers/Service/serviceResolversInputs";
import wineryServices from "../dataServices/winery";

const experiencesWithCursor = async (
    realLimit: number, 
    cursor : string | null, 
    experienceName : string | null, 
    eventType : EventType[] | null,
    valley: Valley[] | null,
    state: string | null
    ) => {
    // se deja el state listo para el proximo query
    console.log(state);

    const qs = getRepository(Service).
    createQueryBuilder('experience').
    orderBy("experience.createdAt", "DESC").
    take(realLimit + 1);

    if (cursor) {
        qs.andWhere('experience."createdAt" < :createdAt ', {createdAt:cursor})
    }

    if (experienceName) {
        qs.andWhere("experience.title like :title", { title:`%${experienceName}%` })
    }
    if (eventType) {
        qs.andWhere('experience."eventType" IN (:...eventType)', { eventType:eventType })
    }
    if (valley) {
        const wineries = await wineryServices.findWineryByValley(valley);
        const wineriesIds = wineries.map((winery) => winery.id)
        qs.andWhere('experience."wineryId" IN (:...wineriesIds)', { wineriesIds:wineriesIds })
    }

    return await qs.getMany();
}

const experiences = async (realLimit: number) => {
    const replacements: any = [realLimit + 1];
    return await getConnection().query(SQL_QUERY_SELECT_PAGINATED_EXPERIENCES, replacements);
}

const getAllExperiences = async () => {
    return await Service.find();
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
    updateService,
    getAllExperiences
}