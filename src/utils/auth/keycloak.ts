import { AuthChecker } from "type-graphql";
import { ApolloKeycloakContext } from "../../apollo-config";

export const keycloakAuthChecker: AuthChecker<ApolloKeycloakContext> = (
  { context },
  roles
) => {
  if (!context.kauth.isAuthenticated()) {
    return false;
  }
  const notEvenOneRole = !(
    roles &&
    roles.length > 0 &&
    !roles.some((role) => context.kauth.hasRole(role))
  );
  let userType = "";
  try {
    // @ts-ignore
    userType = context.kauth.accessToken.content.userType;
  } catch (e) {
    throw new Error("Error authenticating");
  }
  if (roles.includes(userType)) {
    return true;
  }

  return notEvenOneRole;
};
