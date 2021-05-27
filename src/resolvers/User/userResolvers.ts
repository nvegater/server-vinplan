import {Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware} from "type-graphql"
import {User} from "../../entities/User";
import argon2 from 'argon2'
import {FieldError, UserResponse, WineryResponse, SendUserValidationResponse} from "./userResolversOutputs";
import {
    ChangePasswordInputs,
    LoginInputs,
    RegisterInputs,
    UserType,
    validateInputsLogin,
    validateInputsRegister,
    WineryDataInputs,
    UserToEdit
} from "./userResolversInputs";
import {SessionCookieName} from "../../redis-config";
import {ApolloRedisContext} from "../../apollo-config";
import {FORGET_PASSWORD_PREFIX, VALIDATE_USER_PREFIX} from "../../constants";
import userResolversErrors from "./userResolversErrors";
import {isAuth} from "../Universal/utils";
import {getConnection} from "typeorm";
import {SQL_QUERY_GET_RESERVED_SERVICES_IDS} from "../Universal/queries";
import {Winery} from "../../entities/Winery";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import getUser from "../../useCases/user/getUser";
import forgotPassword from "../../useCases/user/forgotPassword";
import updateUser from "../../useCases/user/updateUser";
import registerUser from "../../useCases/user/registerUser";
import userValidation from "../../useCases/user/userValidation"
import sendValidateUserEmail from "../../useCases/user/sendValidateUserEmail"
import changePasswordFunction from "../../useCases/user/changePassword";

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
        const inputErrors: FieldError[] = validateInputsRegister(registerInputs);
        inputErrors.push(...validateInputsRegister(registerInputs))
        if (inputErrors.length > 0) {
            // Level 1: Simple input validation
            return {errors: inputErrors}
        }
        const userWithUsernameExists: User | undefined = await User.findOne({where: {username: registerInputs.username}});
        if (userWithUsernameExists) {
            // Level 1
            return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)}
        } else {
            const userWithEmailExists: User | undefined = await User.findOne({where: {email: registerInputs.email}});
            if (userWithEmailExists) {
                // Level 2
                return {errors: inputErrors.concat(userResolversErrors.emailInUseError)}
            } else {
                const wineryWithThatNameExists: Winery | undefined = await Winery.findOne({where: {name: wineryDataInputs.name}});
                if (wineryWithThatNameExists) {
                    // Level 3
                    return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)} // TODO add winery errors
                } else {

                    const user = User.create({
                        username: registerInputs.username,
                        email: registerInputs.email,
                        password: await argon2.hash(registerInputs.password),
                        visitorOrOwner: true, // From here, logic is different than normal registry
                        userType: UserType.WINERY_OWNER,
                    });
                    await user.save();
                    const creatorId = user.id;
                    const winery = Winery.create({
                            name: wineryDataInputs.name,
                            description: wineryDataInputs.description,
                            foundationYear: wineryDataInputs.foundationYear,
                            googleMapsUrl: !!wineryDataInputs.googleMapsUrl ? wineryDataInputs.googleMapsUrl : "",
                            yearlyWineProduction: wineryDataInputs.yearlyWineProduction,
                            creatorId: creatorId,
                            contactEmail: wineryDataInputs.contactEmail,
                            contactPhoneNumber: wineryDataInputs.contactPhoneNumber,
                            valley: wineryDataInputs.valley,
                            covidLabel : wineryDataInputs.covidLabel
                        }
                    )
                    await winery.save();

                    const wineTypes = wineryDataInputs.wineType.map((wineType) => {
                        return WineType.create({
                            wineryId: winery.id,
                            wineType: wineType,
                        })
                    })

                    wineTypes.map(async (wineTypeEntity) => {
                        await wineTypeEntity.save();
                    })

                    const productionTypes = wineryDataInputs.productionType.map((productionType) => {
                        return WineProductionType.create({
                            wineryId: winery.id,
                            productionType: productionType
                        })
                    })

                    productionTypes.map(async (productionTypeEntity) => {
                        await productionTypeEntity.save();
                    })

                    if (wineryDataInputs.supportedLanguages && wineryDataInputs.supportedLanguages?.length > 0) {
                        wineryDataInputs.supportedLanguages.map(async (supLan) => {
                            const wineLanEntity = WineryLanguage.create({
                                wineryId: winery.id,
                                supportedLanguage: supLan
                            });
                            await wineLanEntity.save()
                        });
                    }

                    if (wineryDataInputs.amenities && wineryDataInputs.amenities?.length > 0) {
                        wineryDataInputs.amenities.map(async (amenity) => {
                            const amenityEntity = WineryAmenity.create({
                                wineryId: winery.id,
                                amenity: amenity
                            });
                            await amenityEntity.save()
                        });
                    }

                    // @ts-ignore
                    req.session.userId = user.id;


                    return {winery: winery}
                }
            }
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") loginInputs: LoginInputs,
        @Ctx() {req}: ApolloRedisContext
    ): Promise<UserResponse> {
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

                // @ts-ignore
                req.session.userId = user.id;
                const reservedServicesIds = await getConnection()
                    .query(SQL_QUERY_GET_RESERVED_SERVICES_IDS, [user.id]);

                if (reservedServicesIds[0].reservedServicesIds.length > 0 && user) {
                    user.reservedServicesIds = reservedServicesIds[0].reservedServicesIds as number[];
                }

                if (user.userType === UserType.WINERY_OWNER) {
                    const createdWinery = await Winery.findOne({where: {creatorId: user.id}})
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
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("options") changePasswordInputs: ChangePasswordInputs,
        @Ctx() {redis, req}: ApolloRedisContext
    ): Promise<UserResponse> {
        try {
            const inputErrors: FieldError[] = [];
            const key = FORGET_PASSWORD_PREFIX + changePasswordInputs.token;
            const userId = await redis.get(key);
            if (!userId) {
                return {errors: inputErrors.concat(userResolversErrors.tokenUserError)}
            } else {
                const response = await changePasswordFunction(changePasswordInputs, userId)
                if(response.user) {
                    // @ts-ignore
                    req.session.userId = response.user.id;
                    await redis.del(key);
                }
                return response
            }
        } catch (error) {
            throw new Error(error)
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
    ): Promise<UserResponse> {
        try {            
            return await forgotPassword(email, redis)
        } catch (error) {
            throw new Error(error)
        }
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