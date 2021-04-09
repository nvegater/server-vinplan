import {User} from "../entities/User";
import {RegisterInputs} from "../resolvers/User/userResolversInputs";
import argon2 from "argon2";

const findUserById = async (userId: number) => {
    return await User.findOne(userId);
}

const findUserByUsername = async (username: string) => {
    return await User.findOne({where: {username: username}})
}

const findUserByEmail = async (email: string) => {
    return await User.findOne({where: {email: email}})
}

const persistUser = async (registerInputs:RegisterInputs) => {
    const user = User.create({
        username: registerInputs.username,
        email: registerInputs.email,
        password: await argon2.hash(registerInputs.password),
        userType: registerInputs.userType
    });
    await user.save();
    return user;
}

export default {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    persistUser
}