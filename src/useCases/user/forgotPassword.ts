import {User} from "../../entities/User";
import user from "../../dataServices/user"
import {FieldError, UserResponse} from "../../resolvers/User/userResolversOutputs";
import {validateEmail} from "../../resolvers/User/userResolversInputs";
import {v4 as uuidv4} from "uuid";
import {FORGET_PASSWORD_PREFIX} from "../../constants";
import sendEmail from "../../utils/sendEmail";

const forgotPassword = async (email : string, redis : any): Promise<UserResponse> => {
    try {
        const inputErrors: FieldError[] = validateEmail(email);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        const userFound: User | undefined = await user.findUserByEmail(email); // not primary key, so "where" needed
        if (!userFound) {
            // email not in DB but just do nothing
            return {errors: inputErrors}
        }
        const token = uuidv4();
        const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;
        await redis.set(FORGET_PASSWORD_PREFIX + token, // with this key
            userFound.id, // access this value
            "ex", // that expires
            THREE_DAYS_MS); // after 3 days
        const emailData = {
            sender: '"Vin plan" <no-reply@vinplan>',
            email,
            subject : "Change password",
            html : `<a href="${process.env.CORS_ORIGIN_WHITELIST_1}/change-password/${token}"> reset password </a>`
        }    
        await sendEmail(emailData)
        return {user: userFound}
    } catch (error) {
        throw new Error(error)
    }
}

export default forgotPassword;