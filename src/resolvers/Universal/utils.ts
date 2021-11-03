import { AuthChecker, MiddlewareFn } from "type-graphql";
import { ApolloKeycloakContext, ApolloRedisContext } from "../../apollo-config";
import postResolversErrors from "../Post/postResolversErrors";

// Middleware runs before each resolver
// check if the user is logged in.
export const isAuth: MiddlewareFn<ApolloRedisContext> = async (
  { context },
  next
) => {
  // @ts-ignore
  const loggedInUserId: string | undefined = context.req.session!.userId;
  if (!loggedInUserId) {
    return { errors: [postResolversErrors.userNotLoggedInError] };
  }
  return next();
};

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
