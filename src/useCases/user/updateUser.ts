
import {UserResponse} from "../../resolvers/User/userResolversOutputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import userDataServices from "../../dataServices/user";
import {UserToEdit} from "../../resolvers/User/userResolversInputs"
const updateUser = async (userId: number, userData: UserToEdit): Promise<UserResponse> => {

    const user = await userDataServices.findUserById(userId);

    if (user === undefined) {
        return {errors: [userResolversErrors.userNotFoundError]}
    }

    console.log(userData);


    // const reservedServicesIds = await serviceReservationDataServices.findIdsFromServicesReservedByUserId(userId)
    // const userHasReservations = reservedServicesIds[0].reservedServicesIds.length > 0;
    // if (userHasReservations) {
    //     user.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
    //     user.reservedServices = await serviceReservationDataServices.findUserReservations(userId);
    // }

    // const createdWinery = await wineryDataServices.findWineryByCreator(userId)
    // user.wineryId = createdWinery ? createdWinery.id : null;

    return {
        user: user
    };

}

export default updateUser;