import {Service} from "../entities/Service";
import {getConnection, Not} from "typeorm";

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

const findServicesByWinery = async (wineryId : number) => {
    return await Service.find({where: {wineryId: wineryId}})
}

const findServiceById = async (serviceId:number) => {
    return await Service.findOne(serviceId)
}

export default {
    findServiceNotMadeByCreatorByServiceAndCreatorId,
    findServiceByParentIdAndStartDateTime,
    updateAttendeesByIdAndCreator,
    findServicesByWinery,
    findServiceById,
    findServicesByIds
}