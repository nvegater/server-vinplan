import userDataServices from "../dataServices/userDataServices";
import {UserResponse} from "../resolvers/User/userResolversOutputs";
import userResolversErrors from "../resolvers/User/userResolversErrors";

const getUser = async (userId: number): Promise<UserResponse> => {

    const userDB = await userDataServices.findUserById(userId);

    if (userDB === undefined) {
        return {errors: [userResolversErrors.userNotFoundError]}
    }

    const reservedServicesIds = await userDataServices.findIdsFromServicesReservedByUser(userId)
    const userHasReservations = reservedServicesIds[0].reservedServicesIds.length > 0;
    if (userHasReservations) {
        userDB.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
        userDB.reservedServices = await userDataServices.findUserReservations(userId);
    }

    const createdWinery = await userDataServices.findCreatedWinery(userId)
    if (createdWinery) {
        userDB.wineryId = createdWinery.id;
    } else {
        userDB.wineryId = null;
    }

    return {
        user: userDB
    };

}

export default getUser;