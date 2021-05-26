import argon2 from 'argon2'
import {User} from "../../entities/User";
import {ChangePasswordInputs} from "../../resolvers/User/userResolversInputs"
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {FieldError, UserResponse} from "../../resolvers/User/userResolversOutputs";
import {validateInputsChangePassword} from "../../resolvers/User/userResolversInputs";
import sendEmail from "../../utils/sendEmail";
import passwordChangedHtml from "../../utils/emailsTemplates/passwordChanged/passwordChanged"

const changePassword = async (changePasswordInputs : ChangePasswordInputs, userId : string = "0"): Promise<UserResponse> => {
    try {
        let user = undefined;
        const inputErrors: FieldError[] = validateInputsChangePassword(changePasswordInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        
        
        if (!userId) {
            return {errors: inputErrors.concat(userResolversErrors.tokenExpired)}
        } else {
            const userIdNum = parseInt(userId);
            user = await User.findOne(userIdNum);
            if (!user) {
                return {errors: inputErrors.concat(userResolversErrors.tokenUserError)}
            } else {
                await User.update({
                    id: userIdNum //based on the criteria
                }, { // update this part of the entity:
                    password: await argon2.hash(changePasswordInputs.newPassword)
                });
            }
        }


        const emailData = {
            sender: '"Vin plan" <no-reply@vinplan>',
            email : user.email,
            subject : "Changed password",
            html : passwordChangedHtml(),
            attachments: [
                {
                    filename: 'brand.png',
                    path: 'src/utils/emailsTemplates/emailRecovery/brand.png',
                    cid: 'uniq-brand.png'
                },
                {
                    filename: 'lock.png',
                    path: 'src/utils/emailsTemplates/emailRecovery/lock.png',
                    cid: 'uniq-lock.png'
                }
            ]
        }    
        await sendEmail(emailData)
        return {user : user}
    } catch (error) {
        throw new Error(error)
    }
}

export default changePassword;