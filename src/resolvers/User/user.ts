import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql"
import {ApolloORMContext} from "../../types";
import {User} from "../../entities/User";
import argon2 from 'argon2'
import {UserResponse} from "./userResponse";
import {FieldError} from "./errors";
import {CredentialsInputs} from "./arguments";
import {SessionCookieName} from "../../redis-config";

const validateInputsRegister = (inputs: CredentialsInputs): FieldError[] => {
    let inputErrors: FieldError[] = [];

    const USERNAME_GIVEN = inputs.username.length > 0;
    const USERNAME_SHORT = inputs.username.length <= 2;

    if (USERNAME_GIVEN && USERNAME_SHORT) {
        inputErrors.push({
            field: Object.keys(inputs)[0],
            message: "username too short"
        })
    }

    if (!USERNAME_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[0],
            message: "username missing"
        })
    }

    const email = inputs.email;
    const EMAIL_GIVEN = email.length > 0;
    const EMAIL_VALID = email.includes('@') && email.includes('.');

    if (EMAIL_GIVEN && !EMAIL_VALID) {
        inputErrors.push({
            field: Object.keys(inputs)[1],
            message: "email is invalid"
        })
    }

    if (!EMAIL_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[1],
            message: "email missing"
        })
    }

    const PASSWORD_GIVEN = inputs.password.length > 0;
    const PASSWORD_SHORT = inputs.password.length <= 2;

    if (PASSWORD_GIVEN && PASSWORD_SHORT) {
        inputErrors.push({
            field: Object.keys(inputs)[2],
            message: "try a better password"
        })
    }

    if (!PASSWORD_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[2],
            message: "password missing"
        })
    }
    return inputErrors;
}

const validateInputsLogin = (inputs: CredentialsInputs): FieldError[] => {
    let inputErrors: FieldError[] = [];

    const USERNAME_GIVEN = inputs.username.length > 0;
    if (!USERNAME_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[0],
            message: "username missing"
        })
    }

    const email = inputs.email;
    const EMAIL_GIVEN = email.length > 0;
    const EMAIL_VALID = email.includes('@') && email.includes('.');

    if (EMAIL_GIVEN && !EMAIL_VALID) {
        inputErrors.push({
            field: Object.keys(inputs)[1],
            message: "email is invalid"
        })
    }

    if (!EMAIL_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[1],
            message: "email missing"
        })
    }

    const PASSWORD_GIVEN = inputs.password.length > 0;
    if (!PASSWORD_GIVEN) {
        inputErrors.push({
            field: Object.keys(inputs)[1],
            message: "password missing"
        })
    }
    return inputErrors;
}

@Resolver()
export class UserResolver {

    @Query(() => User, {nullable: true}) //Duplication for Graphql: Post
    async me(
        @Ctx() {req, postgresORM}: ApolloORMContext
    ) {
        console.log(req.session!.userId)
        return req.session!.userId ?
            await postgresORM.findOne(User, {id: req.session!.userId}) :
            null;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") inputArgs: CredentialsInputs,
        @Ctx() {req, postgresORM}: ApolloORMContext
    ): Promise<UserResponse> {

        const inputErrors: FieldError[] = validateInputsRegister(inputArgs);

        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }

        const hashedPassword = await argon2.hash(inputArgs.password)

        const userExists = await postgresORM.findOne(User, {username: inputArgs.username});
        if (userExists) {
            inputErrors.push({
                field: Object.keys(inputArgs)[0],
                message: "User already exists"
            })
            return {errors: inputErrors}
        } else {
            const emailExists = await postgresORM.findOne(User, {email: inputArgs.email});
            if (emailExists){
                inputErrors.push({
                    field: Object.keys(inputArgs)[1],
                    message: "That email is already in use"
                })
                return {errors: inputErrors}
            } else {
                const user = postgresORM.create(User, {
                    username: inputArgs.username,
                    email: inputArgs.email,
                    password: hashedPassword
                });
                await postgresORM.persistAndFlush(user);
                console.log("User after register: ", user)
                // Login right after registering.
                req.session!.userId = user.id;
                return {user: user}
            }
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") inputArgs: CredentialsInputs,
        @Ctx() {req, postgresORM}: ApolloORMContext
    ): Promise<UserResponse> {

        const inputErrors: FieldError[] = validateInputsLogin(inputArgs);
        if (inputErrors.length > 0) {
            return {errors: inputErrors}
        }

        const user: User | null = await postgresORM.findOne(User, {username: inputArgs.username})
        // if an user is returned, verify given password.
        const userPassMatch = user !== null ? await argon2.verify(user.password, inputArgs.password) : false;

        if (!user || !userPassMatch) {
            inputErrors.push({
                field: Object.keys(inputArgs)[0],
                message: "-"
            })
            inputErrors.push({
                field: Object.keys(inputArgs)[1],
                message: "the username or password is invalid"
            })
            return {errors: inputErrors}
        } else {
            // Us/Pass valid --> Client deserves an id.
            // Access Session object in request header.
            // Start a unique session by setting an id in the request header
            req.session!.userId = user.id;
            return {user: user}
        }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() {req, res}: ApolloORMContext
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

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() {req, postgresORM}: ApolloORMContext
    ) {
        console.log(email, req, postgresORM)
        //const user = await postgresORM.findOne(User, {email})
        return true
    }


}