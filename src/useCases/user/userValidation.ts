import {UserResponse} from "../../resolvers/User/userResolversOutputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import serviceReservationDataServices from "../../dataServices/serviceReservation"
import wineryDataServices from "../../dataServices/winery"
import {VALIDATE_USER_PREFIX} from "../../constants";
import userDataServices from "../../dataServices/user"

const userValidation = async (token: String, redis: any): Promise<UserResponse> => {

    const key = VALIDATE_USER_PREFIX + token;
    const userId = await redis.get(key);
    let user = await userDataServices.updateUser(userId, {verified : true});

    if (user === undefined) {
        return {errors: [userResolversErrors.tokenError]}
    }

    const reservedServicesIds = await serviceReservationDataServices.findIdsFromServicesReservedByUserId(userId)
    const userHasReservations = reservedServicesIds[0].reservedServicesIds.length > 0;
    if (userHasReservations) {
        user.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
        user.reservedServices = await serviceReservationDataServices.findUserReservations(userId);
    }

    const createdWinery = await wineryDataServices.findWineryByCreator(userId)
    user.wineryId = createdWinery ? createdWinery.id : null;

    return {
        user: user
    };

}

export default userValidation;
