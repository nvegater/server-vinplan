
import {UserResponse} from "../../resolvers/User/userResolversOutputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import userDataServices from "../../dataServices/user";
import {UserToEdit} from "../../resolvers/User/userResolversInputs"
const updateUser = async (userId: number, userData: UserToEdit): Promise<UserResponse> => {

    const updateUser = await userDataServices.updateUser(userId, userData)
    if (updateUser === undefined) {
        // Pregunta: ¿debo de realizar la construccion de estos elementos aqui?
        // o puedo hacerlo desde el userDataServices
        return {errors: [userResolversErrors.userNotFoundError]}
    }
    return {
        user: updateUser
    };

}

export default updateUser;