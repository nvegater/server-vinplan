import {User} from "../entities/User";
import userResolversErrors from "../resolvers/User/userResolversErrors";
import {RegisterInputs} from "../resolvers/User/userResolversInputs";
import {UserResponse} from "../resolvers/User/userResolversOutputs";
import userDataServices from "../dataServices/userDataServices";

const registerUser = async (registerInputs: RegisterInputs): Promise<UserResponse> => {
    const userWithUsernameExists: User | undefined = await userDataServices.findUserByUsername(registerInputs.username);
    if (userWithUsernameExists) {
        return {errors: [userResolversErrors.usernameInUseError]}
    }
    const userWithEmailExists: User | undefined = await userDataServices.findUserByEmail(registerInputs.email);
    if (userWithEmailExists) {
        return {errors: [userResolversErrors.emailInUseError]}
    }
    const user = await userDataServices.persistUser(registerInputs)

    return {user: user};

}

export default registerUser;
