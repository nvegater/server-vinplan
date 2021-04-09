import {getConnection} from "typeorm";
import {SQL_QUERY_GET_RESERVED_SERVICES_IDS} from "../resolvers/Universal/queries";
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

export default {
    findIdsFromServicesReservedByUserId,
    findUserReservations
}