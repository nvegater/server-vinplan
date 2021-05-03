import {getConnection} from "typeorm";
import {
    SQL_QUERY_GET_RESERVED_SERVICES_IDS,
    SQL_QUERY_INSERT_RESERVATION,
    SQL_QUERY_UPDATE_RESERVATION,
    SQL_QUERY_UPDATE_SERVICE
} from "../resolvers/Universal/queries";
import {ServiceReservation} from "../entities/ServiceReservation";
import wineryServices from "./winery"


const findIdsFromServicesReservedByUserId = async (userId: number) => {
    return await getConnection()
        .query(SQL_QUERY_GET_RESERVED_SERVICES_IDS, [userId])
}

const findUserReservations = async (userId: number) => {
    const findAndCountResponse = await ServiceReservation.findAndCount({where: {userId: userId}});
    return findAndCountResponse[1] === 0 ? [] : findAndCountResponse[0]
}

const findWineryReservations = async (wineryId:number) => {
    const creatorId = await wineryServices.findWineryById(wineryId);
    return await ServiceReservation.find({where: {userId: creatorId}})
}

const findReservationByServiceId = async (serviceId:number) => {
    return await ServiceReservation.findOne({where: {serviceId: serviceId}})
}

const findUserReservationByIdAndUserId = async (serviceId:number, userId:number) => {
    return await ServiceReservation
        .findOne({where: {serviceId, userId}});
}
const insertOrUpdateReservation = async (
    serviceId:number,
    userId: number,
    noOfAttendees:number,
    paypalOrderId:string,
    pricePerPersonInDollars: number,
    paymentCreationDateTime: string,
    status: string,
    creatorId: number,
    parentServiceId: number
) => {
    await getConnection().transaction(async transactionManager => {
        let createOrUpdate = SQL_QUERY_INSERT_RESERVATION;
        const reservationExists = await ServiceReservation.findOne({
            where: {
                serviceId: serviceId,
                userId: userId
            }
        })
        if (reservationExists) {
            createOrUpdate = SQL_QUERY_UPDATE_RESERVATION
        }
        await transactionManager.query(createOrUpdate, [
            noOfAttendees,
            serviceId,
            userId,
            paypalOrderId,
            pricePerPersonInDollars,
            paymentCreationDateTime,
            status
        ]);

        await transactionManager.query(SQL_QUERY_UPDATE_SERVICE, [
            noOfAttendees,
            parentServiceId,
            creatorId
        ])
    });
}

export default {
    findIdsFromServicesReservedByUserId,
    findUserReservations,
    findUserReservationByIdAndUserId,
    insertOrUpdateReservation,
    findWineryReservations,
    findReservationByServiceId
}