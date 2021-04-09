import userDataServices from "../dataServices/userDataServices";
import {UserResponse} from "../resolvers/User/userResolversOutputs";
import userResolversErrors from "../resolvers/User/userResolversErrors";

const getUser = async (userId: number): Promise<UserResponse> => {

    const user = await userDataServices.findUserById(userId);

    if (user === undefined) {
        return {errors: [userResolversErrors.userNotFoundError]}
    }

    const reservedServicesIds = await userDataServices.findIdsFromServicesReservedByUser(userId)
    const userHasReservations = reservedServicesIds[0].reservedServicesIds.length > 0;
    if (userHasReservations) {
        user.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
        user.reservedServices = await userDataServices.findUserReservations(userId);
    }

    const createdWinery = await userDataServices.findCreatedWinery(userId)
    user.wineryId = createdWinery ? createdWinery.id : null;

    return {
        user: user
    };

}

export default getUser;