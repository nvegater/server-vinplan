import { User } from "../../entities/User";
import { v4 as uuidv4 } from "uuid";
import userResolversErrors from "../../resolvers/User/userResolversErrors";
import { RegisterInputs } from "../../resolvers/User/userResolversInputs";
import { UserResponse } from "../../resolvers/User/userResolversOutputs";
import userDataServices from "../../dataServices/user";
import { VALIDATE_USER_PREFIX } from "../../constants";
import sendEmail from "../../utils/sendEmail";
import emailValidationHtml from "../../utils/emailsTemplates/emailValidation/emailValidation";

const registerUser = async (
  registerInputs: RegisterInputs,
  redis: any
): Promise<UserResponse> => {
  const userWithUsernameExists: User | undefined =
    await userDataServices.findUserByUsername(registerInputs.username);
  if (userWithUsernameExists) {
    return { errors: [userResolversErrors.usernameInUseError] };
  }
  const userWithEmailExists: User | undefined =
    await userDataServices.findUserByEmail(registerInputs.email);
  if (userWithEmailExists) {
    return { errors: [userResolversErrors.emailInUseError] };
  }
  const user = await userDataServices.persistUser(registerInputs);
  const token = uuidv4();
  const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;
  await redis.set(
    VALIDATE_USER_PREFIX + token, // with this key
    user.id, // access this value
    "ex", // that expires
    THREE_DAYS_MS
  ); // after 3 days
  const emailData = {
    sender: '"Vin plan" <no-reply@vinplan>',
    email: registerInputs.email,
    subject: "Validate Register",
    html: emailValidationHtml(token),
    attachments: [
      {
        filename: "brand.png",
        path: "src/utils/emailsTemplates/emailValidation/brand.png",
        cid: "uniq-brand.png",
      },
      {
        filename: "mailIlu.png",
        path: "src/utils/emailsTemplates/emailValidation/mailIlu.png",
        cid: "uniq-mailIlu.png",
      },
    ],
  };
  await sendEmail(emailData);

  return { user: user };
};

export default registerUser;
