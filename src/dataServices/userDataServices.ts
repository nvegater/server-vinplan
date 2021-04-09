import {User} from "../entities/User";
import {getConnection} from "typeorm";
import {SQL_QUERY_GET_RESERVED_SERVICES_IDS} from "../resolvers/Universal/queries";
import {ServiceReservation} from "../entities/ServiceReservation";
import {Winery} from "../entities/Winery";
import {RegisterInputs} from "../resolvers/User/userResolversInputs";
import argon2 from "argon2";

const findUserById = async (userId: number) => {
    return await User.findOne(userId);
}

const findUserByUsername = async (username: string) => {
    return await User.findOne({where: {username: username}})
}

const findUserByEmail = async (email: string) => {
    return await User.findOne({where: {email: email}})
}

const findIdsFromServicesReservedByUser = async (userId: number) => {
    return await getConnection()
        .query(SQL_QUERY_GET_RESERVED_SERVICES_IDS, [userId])
}

const findUserReservations = async (userId: number) => {
    const findAndCountResponse = await ServiceReservation.findAndCount({where: {userId: userId}});
    // first element is the Services, second is the count
    return findAndCountResponse[0]
}
const findCreatedWinery = async (userId: number) => {
    return await Winery.findOne({where: {creatorId: userId}})
}

const persistUser = async (registerInputs:RegisterInputs) => {
    const user = User.create({
        username: registerInputs.username,
        email: registerInputs.email,
        password: await argon2.hash(registerInputs.password),
        userType: registerInputs.userType
    });
    await user.save();
    return user;
}

export default {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    findIdsFromServicesReservedByUser,
    findUserReservations,
    findCreatedWinery,
    persistUser
}