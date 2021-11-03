import { User } from "../entities/User";
import {
  RegisterInputs,
  UserToEdit,
  UserType,
  WineryDataInputs,
} from "../resolvers/User/userResolversInputs";
import { Winery } from "../entities/Winery";
import argon2 from "argon2";

const findUserById = async (userId: number) => {
  return await User.findOne(userId);
};

const findUserByUsername = async (username: string) => {
  return await User.findOne({ where: { username: username } });
};

const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email: email } });
};

const persistUser = async (registerInputs: RegisterInputs) => {
  const user = User.create({
    username: registerInputs.username,
    email: registerInputs.email,
    password: await argon2.hash(registerInputs.password),
    userType: registerInputs.userType,
  });
  await user.save();
  return user;
};

const createUser = async (registerInputs: RegisterInputs) => {
  const user = User.create({
    username: registerInputs.username,
    email: registerInputs.email,
    password: await argon2.hash(registerInputs.password),
    visitorOrOwner: true, // From here, logic is different than normal registry
    userType: UserType.WINERY_OWNER,
  });
  await user.save();
  return user;
};

const createWinery = async (
  wineryDataInputs: WineryDataInputs,
  creatorId: number
) => {
  const winery = Winery.create({
    name: wineryDataInputs.name,
    description: wineryDataInputs.description,
    foundationYear: wineryDataInputs.foundationYear,
    googleMapsUrl: !!wineryDataInputs.googleMapsUrl
      ? wineryDataInputs.googleMapsUrl
      : "",
    yearlyWineProduction: wineryDataInputs.yearlyWineProduction,
    creatorId: creatorId,
    contactEmail: wineryDataInputs.contactEmail,
    contactPhoneNumber: wineryDataInputs.contactPhoneNumber,
    valley: wineryDataInputs.valley,
    covidLabel: wineryDataInputs.covidLabel,
  });
  await winery.save();
  return winery;
};

const updateUser = async (userId: number, userToEdit: UserToEdit) => {
  try {
    const userFound = await findUserById(userId);
    if (userFound === undefined) {
      return userFound;
    } else {
      Object.assign(userFound, userToEdit);
      return await userFound.save();
    }
  } catch (error) {
    return error;
  }
};

export default {
  findUserById,
  findUserByUsername,
  findUserByEmail,
  persistUser,
  updateUser,
  createUser,
  createWinery,
};
