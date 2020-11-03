import {Field, ObjectType} from "type-graphql";
import {RegisterInputs, LoginInputs} from "./arguments";

/**
 * This file is for error types of resolvers related to an user
 * **/
@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

enum Fields {
    username = "username",
    email = "email",
    password = "password",
}

// User input dependant errors
const usernameMissingInputError: FieldError = {
    field: Fields.username,
    message: "User already exists"
}
const usernameTooShortInputError: FieldError = {
    field: Fields.username,
    message: "username too short"
}
const usernameOrEmailMissingInputError: FieldError = {
    field: Fields.username,
    message: "Provide a username or an email"
}
const emailIsInvalidInputError: FieldError = {
    field: Fields.email,
    message: "email is invalid"
}
const emailIsMissingInputError: FieldError = {
    field: Fields.email,
    message: "email is missing"
}
const passwordTooShortInputError: FieldError = {
    field: Fields.password,
    message: "try a better password" // Dont give the reason of bad password
}
const passwordMissingInputError: FieldError = {
    field: Fields.password,
    message: "password missing" // Dont give the reason of bad password
}
export const validateInputsLogin = (inputs: LoginInputs): FieldError[] => {
    let inputErrors: FieldError[] = [];
    const USERNAME_OR_EMAIL_GIVEN = inputs.usernameOrPassword.length > 0;
    if (!USERNAME_OR_EMAIL_GIVEN) {
        inputErrors.push(usernameOrEmailMissingInputError)
    }
    const PASSWORD_GIVEN = inputs.password.length > 0;
    if (!PASSWORD_GIVEN) {
        inputErrors.push(passwordMissingInputError)
    }
    return inputErrors;
}

export const validateInputsRegister = (inputs: RegisterInputs): FieldError[] => {
    let inputErrors: FieldError[] = [];

    const USERNAME_GIVEN = inputs.username.length > 0;
    if (!USERNAME_GIVEN) {
        inputErrors.push(usernameMissingInputError)
    } else {
        const USERNAME_SHORT = inputs.username.length <= 2;
        if (USERNAME_SHORT) {
            inputErrors.push(usernameTooShortInputError)
        }
    }
    const EMAIL_GIVEN = inputs.email.length > 0;
    if (!EMAIL_GIVEN) {
        inputErrors.push(emailIsMissingInputError)
    } else {
        const EMAIL_VALID = inputs.email.includes('@') && inputs.email.includes('.');
        if (!EMAIL_VALID) {
            inputErrors.push(emailIsInvalidInputError)
        }
    }
    const PASSWORD_GIVEN = inputs.password.length > 0;
    if (!PASSWORD_GIVEN) {
        inputErrors.push(passwordMissingInputError)
    } else {
        if (inputs.password.length <= 2) {
            inputErrors.push(passwordTooShortInputError)
        }
    }
    return inputErrors;
}
// Database dependant errors
export const invalidCredentials: FieldError[] = [
    {
        field: Fields.username,
        message: "-"
    },
    {
        field: Fields.email,
        message: "-"
    },
    {
        field: Fields.password,
        message: "Invalid username, email or password"
    }];

export const usernameInUseError: FieldError = {
    field: Fields.username,
    message: "User already exists"
}
export const emailInUseError: FieldError = {
    field: Fields.email,
    message: "That email is already in use"
}

