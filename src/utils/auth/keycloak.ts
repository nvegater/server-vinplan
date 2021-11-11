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
  if (context.kauth.accessToken) {
    console.log(context.kauth.accessToken);
    return false;
  }

  console.log(context.kauth.accessToken);
  return notEvenOneRole;
};
