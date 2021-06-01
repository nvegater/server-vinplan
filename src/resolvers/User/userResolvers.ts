import {Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql"
import {User} from "../../entities/User";
import argon2 from 'argon2'
import {FieldError, UserResponse, WineryResponse, SendUserValidationResponse} from "./userResolversOutputs";
import {
    ChangePasswordInputs,
    LoginInputs,
    RegisterInputs,
    validateInputsChangePassword,
    validateInputsRegister,
    WineryDataInputs,
    UserToEdit
} from "./userResolversInputs";
import {SessionCookieName} from "../../redis-config";
import {ApolloRedisContext} from "../../apollo-config";
import {FORGET_PASSWORD_PREFIX, VALIDATE_USER_PREFIX} from "../../constants";
import userResolversErrors from "./userResolversErrors";
import {isAuth} from "../Universal/utils";
import getUser from "../../useCases/user/getUser";
import updateUser from "../../useCases/user/updateUser";
import forgotPassword from "../../useCases/user/forgotPassword";
import registerUser from "../../useCases/user/registerUser";
import registerWinery from "../../useCases/user/registerWinery";
import userValidation from "../../useCases/user/userValidation"
import sendValidateUserEmail from "../../useCases/user/sendValidateUserEmail"
import userLogin from "src/useCases/user/userLogin";

@Resolver(User)
export class UserResolver {


    @FieldResolver(() => String)
    email( // Extra graphql Field, but not from the DB-> Main entity.
        @Root() user: User,
        @Ctx() {req}: ApolloRedisContext
    ) {
        // this is the current user and its okay to show them their own email
        // @ts-ignore
        if (req.session.userId === user.id) {
            return user.email;
        }
        // current user wants to see someone elses email
        return "";
    }

    @Query(() => UserResponse, {nullable: true})
    @UseMiddleware(isAuth)
    async me(
        @Ctx() {req}: ApolloRedisContext
    ): Promise<UserResponse> {
        // @ts-ignore
        const userIdFromSession = req.session.userId;
        return await getUser(userIdFromSession)
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") registerInputs: RegisterInputs,
        @Ctx() {redis, req}: ApolloRedisContext
    ): Promise<UserResponse> {
        const inputErrors: FieldError[] = validateInputsRegister(registerInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        const registerResult: UserResponse = await registerUser(registerInputs, redis);
        if (registerResult.errors && registerResult.errors.length > 0) {
            return {errors: registerResult.errors}
        }
        // @ts-ignore
        req.session.userId = registerResult.user.id;
        return registerResult
    }

    @Mutation(() => UserResponse)
    async validateUser(
        @Arg("token") token : String,
        @Ctx() {redis,req}: ApolloRedisContext
    ): Promise<UserResponse> {
        const key = VALIDATE_USER_PREFIX + token;
        const userId = await redis.get(key)
        const validatedUser = await userValidation(parseInt(userId || '0'));
        if (validatedUser.user) {
            // @ts-ignore
            req.session.userId = validatedUser.user.id;
            await redis.del(key);
        }
        return validatedUser
    }

    @Mutation(() => SendUserValidationResponse, {nullable: true})
    @UseMiddleware(isAuth)
    async sendUserValidation(
        @Ctx() {redis, req}: ApolloRedisContext
    ): Promise<SendUserValidationResponse> {
        // @ts-ignore
        const userIdFromSession = req.session.userId;
        return await sendValidateUserEmail(userIdFromSession,redis)
    }

    @Mutation(() => WineryResponse)
    async registerWinery(
        @Arg("options") registerInputs: RegisterInputs,
        @Arg("wineryDataInputs") wineryDataInputs: WineryDataInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<WineryResponse> {
        // @ts-ignore
        const userId = req.session.userId;
        return await registerWinery(registerInputs, wineryDataInputs, userId);
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") loginInputs: LoginInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<UserResponse> {
        // @ts-ignore
        const userId = req.session.userId;
        return await userLogin(loginInputs, userId)
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("options") changePasswordInputs: ChangePasswordInputs,
        @Ctx() {redis, req}: ApolloRedisContext
    ): Promise<UserResponse> {
        const inputErrors: FieldError[] = validateInputsChangePassword(changePasswordInputs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }
        const key = FORGET_PASSWORD_PREFIX + changePasswordInputs.token;
        const userId = await redis.get(key);
        if (!userId) {
            return {errors: inputErrors.concat(userResolversErrors.tokenExpired)}
        } else {
            const userIdNum = parseInt(userId);
            const user: User | undefined = await User.findOne(userIdNum);
            if (!user) {
                return {errors: inputErrors.concat(userResolversErrors.tokenUserError)}
            } else {
                await User.update({
                    id: userIdNum //based on the criteria
                }, { // update this part of the entity:
                    password: await argon2.hash(changePasswordInputs.newPassword)
                });
                await redis.del(key);
                // Login automatically
                // @ts-ignore
                req.session.userId = user.id;
                return {user: user}
            }
        }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() {req, res}: ApolloRedisContext
    ) {
        return new Promise((resolvePromise) => {
            req.session?.destroy((err) => {
                if (err) {
                    console.log(err);
                    resolvePromise(false)
                    return;
                }
                res.clearCookie(SessionCookieName)
                resolvePromise(true)
            })
        })
    }

    @Mutation(() => UserResponse)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {redis}: ApolloRedisContext
    ) : Promise <UserResponse>{
        return await forgotPassword(email, redis);
    }

    @Mutation(() => UserResponse)
    @UseMiddleware(isAuth)
    async updateUser(
        @Arg('user') user: UserToEdit,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<UserResponse> {
        // Buscando el id desde la session para poder actualizar el usuario
        // @ts-ignore
        const userIdFromSession = req.session.userId;
        return await updateUser(userIdFromSession, user)
    }

}