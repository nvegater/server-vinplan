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
    // const userFound = await findUserById(userId)
    console.log(userToEdit, userId);
    // investigar como crear el objeto para guardarlo
    await User.update({id : userId}, {}).then(response => 
    {
        console.log(response.raw[0]);
        response.raw[0]
    });
    
    // return User.save({
    //     ...userFound
    //   });
}

export default {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    persistUser,
    updateUser
}