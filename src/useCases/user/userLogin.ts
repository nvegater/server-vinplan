import argon2 from 'argon2'
import {getConnection} from "typeorm";
import {Winery} from "../../entities/Winery";
import {User} from "../../entities/User";
import {FieldError, UserResponse} from "../../resolvers/User/userResolversOutputs";
import {validateInputsLogin, LoginInputs, UserType} from "../../resolvers/User/userResolversInputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import {SQL_QUERY_GET_RESERVED_SERVICES_IDS} from "../../resolvers/Universal/queries";

const userLogin = async (loginInputs : LoginInputs, userId : number): Promise<UserResponse> => {
    try {
        const inputErrors: FieldError[] = validateInputsLogin(loginInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        // TODO combine with WHERE username = ""  or email = ""
        const user: User | undefined = await User.findOne(loginInputs.usernameOrEmail.includes('@')
            ? {email: loginInputs.usernameOrEmail}
            : {username: loginInputs.usernameOrEmail})

        if (!user) {
            console.log("Failed because username not existing")
            return {errors: inputErrors.concat(userResolversErrors.invalidCredentials)}
        } else {
            const userPassMatch = await argon2.verify(user.password, loginInputs.password);
            if (!userPassMatch) {
                console.log("Failed because user there but wrong password")
                return {errors: inputErrors.concat(userResolversErrors.invalidCredentials)}
            } else {

                
                const reservedServicesIds = await getConnection()
                    .query(SQL_QUERY_GET_RESERVED_SERVICES_IDS, [userId]);

                if (reservedServicesIds[0].reservedServicesIds.length > 0 && user) {
                    user.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
                }

                if (user.userType === UserType.WINERY_OWNER) {
                    const createdWinery = await Winery.findOne({where: {creatorId: userId}})
                    if (createdWinery && user) {
                        user.wineryId = createdWinery.id;
                    } else {
                        return {errors: inputErrors.concat(userResolversErrors.wineryFromUserDeleted)}
                    }
                } else {
                    user.wineryId = null;
                }

                // @ts-ignore
                console.log("Login mutation, this is the user Id", req.session.userId)

                return {user: user}
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default userLogin;