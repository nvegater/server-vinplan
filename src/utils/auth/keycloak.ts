import { AuthChecker } from "type-graphql";
import { ApolloKeycloakContext } from "../../apollo-config";
import { KeycloakContext } from "keycloak-connect-graphql";

const checkRightRoles = (
  keycloakContext: KeycloakContext,
  roles: string[]
): boolean => {
  // @ts-ignore
  const userType = keycloakContext.accessToken.content.userType;
  return roles.length === 0 ? true : roles.includes(userType);
};

export const keycloakAuthChecker: AuthChecker<ApolloKeycloakContext> = (
  { context },
  roles
) => {
  const authenticated = context.kauth.isAuthenticated();
  console.log(authenticated)
  return authenticated
    ? checkRightRoles(context.kauth, roles)
    : false;
};
