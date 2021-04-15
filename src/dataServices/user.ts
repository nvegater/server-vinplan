import {User} from "../entities/User";
import {RegisterInputs, UserToEdit} from "../resolvers/User/userResolversInputs";
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

const updateUser = async (userId : number, userToEdit : UserToEdit) => {
    try {
        const userFound = await findUserById(userId)
        // Pregunta: ¿puedo crear el UserResponse desde aqui? 
        // o esta capa solo es para llamado a base datos?
        if (userFound === undefined) {
            return userFound
        } else {
            Object.assign(userFound, userToEdit);
            return await userFound.save()
        }
    } catch (error) {
        return error;
    }
}

export default {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    persistUser,
    updateUser
}