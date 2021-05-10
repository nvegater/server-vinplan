import {User} from "../../entities/User";
import {v4 as uuidv4} from "uuid";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {SendUserValidationResponse} from "../../resolvers/User/userResolversOutputs";
import userDataServices from "../../dataServices/user";
import {VALIDATE_USER_PREFIX} from "../../constants";
import sendEmail from "../../utils/sendEmail";
import emailValidationHtml from "../../utils/emailsTemplates/emailValidation/emailValidation"

const sendValidateUserEmail = async (userId : number, redis: any): Promise<SendUserValidationResponse> => {
    const user : User | undefined = await userDataServices.findUserById(userId);
    if (user == undefined) {
        return {errors: [userResolversErrors.userNotFoundError]} 
    }else {
        const token = uuidv4();
        const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;
        await redis.set(VALIDATE_USER_PREFIX + token, // with this key
            user.id, // access this value
            "ex", // that expires
            THREE_DAYS_MS); // after 3 days
        const emailData = {
            sender: '"Vin plan" <no-reply@vinplan>',
            email: user.email,
            subject : 'Validate Register',
            html : emailValidationHtml(token),
            attachments: [
                {
                    filename: 'brand.png',
                    path: 'src/utils/emailsTemplates/emailValidation/brand.png',
                    cid: 'uniq-brand.png'
                },
                {
                    filename: 'mailIlu.png',
                    path: 'src/utils/emailsTemplates/emailValidation/mailIlu.png',
                    cid: 'uniq-mailIlu.png'
                }
            ]
        }    
        await sendEmail(emailData)

        return {send: true};
    }
}

export default sendValidateUserEmail;
