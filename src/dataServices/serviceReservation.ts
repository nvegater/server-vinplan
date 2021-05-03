import {getConnection} from "typeorm";
import {
    SQL_QUERY_GET_RESERVED_SERVICES_IDS,
    SQL_QUERY_INSERT_RESERVATION,
    SQL_QUERY_UPDATE_RESERVATION, SQL_QUERY_UPDATE_SERVICE
} from "../resolvers/Universal/queries";
import {ServiceReservation} from "../entities/ServiceReservation";

const findIdsFromServicesReservedByUserId = async (userId: number) => {
    return await getConnection()
        .query(SQL_QUERY_GET_RESERVED_SERVICES_IDS, [userId])
}

const findUserReservations = async (userId: number) => {
    const findAndCountResponse = await ServiceReservation.findAndCount({where: {userId: userId}});
    // first element is the Services, second is the count
    return findAndCountResponse[0]
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
    creatorId: number
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
            serviceId,
            creatorId
        ])
    });
}

export default {
    findIdsFromServicesReservedByUserId,
    findUserReservations,
    findUserReservationByIdAndUserId,
    insertOrUpdateReservation
}