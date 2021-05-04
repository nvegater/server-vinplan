import {User} from "../../entities/User";
import {v4 as uuidv4} from "uuid";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {RegisterInputs} from "../../resolvers/User/userResolversInputs";
import {UserResponse} from "../../resolvers/User/userResolversOutputs";
import userDataServices from "../../dataServices/user";
import {VALIDATE_USER_PREFIX} from "../../constants";
import sendEmail from "../../utils/sendEmail";

const registerUser = async (registerInputs: RegisterInputs, redis : any): Promise<UserResponse> => {
    const userWithUsernameExists: User | undefined = await userDataServices.findUserByUsername(registerInputs.username);
    if (userWithUsernameExists) {
        return {errors: [userResolversErrors.usernameInUseError]}
    }
    const userWithEmailExists: User | undefined = await userDataServices.findUserByEmail(registerInputs.email);
    if (userWithEmailExists) {
        return {errors: [userResolversErrors.emailInUseError]}
    }
    const user = await userDataServices.persistUser(registerInputs)
    const token = uuidv4();
    const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;
    await redis.set(VALIDATE_USER_PREFIX + token, // with this key
        user.id, // access this value
        "ex", // that expires
        THREE_DAYS_MS); // after 3 days
    console.log(registerInputs.email);
    const emailData = {
        sender: '"Fred Foo 👻" <foo@example.com>',
        email: registerInputs.email,
        subject : 'Change password',
        html : `<a href="${process.env.CORS_ORIGIN_WHITELIST_1}/change-password/${token}"> reset password </a>`
    }    
    await sendEmail(emailData)

    return {user: user};

}

export default registerUser;
