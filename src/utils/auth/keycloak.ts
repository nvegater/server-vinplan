import { AuthChecker } from "type-graphql";
import { ApolloKeycloakContext } from "../../apollo-config";

export const keycloakAuthChecker: AuthChecker<ApolloKeycloakContext> = (
  { context },
  roles
) => {
  if (!context.kauth.isAuthenticated()) {
    return false;
  }

  // user did not have at least one roll
  return !(
    roles &&
    roles.length > 0 &&
    !roles.some((role) => context.kauth.hasRole(role))
  );
};
