import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
import { PostResolver } from "./resolvers/Post/postResolvers";
import { UserResolver } from "./resolvers/User/userResolvers";
import { buildSchema } from "type-graphql";
import { Redis } from "ioredis";
import { ContextFunction } from "apollo-server-core";
import { Express, Request, Response } from "express";
import { WineryResolver } from "./resolvers/Winery/wineryResolvers";
import { ServiceResolver } from "./resolvers/Service/serviceResolvers";
import { PresignedResolver } from "./resolvers/PreSignedUrl/presigned";
import { ReservationResolver } from "./resolvers/Reservations/reservations";
import {
  GrantedRequest,
  KeycloakContext,
  KeycloakSchemaDirectives,
  KeycloakTypeDefs,
} from "keycloak-connect-graphql";
import {
  ApolloServerExpressConfig,
  ExpressContext,
  PlaygroundConfig,
  ServerRegistration,
} from "apollo-server-express";
import { Keycloak } from "keycloak-connect";
import { keycloakAuthChecker } from "./resolvers/Universal/utils";

const registerServer = (app: Express) => ({
  app, // Http -express server
  path: "/graphql", // Server listen on this endpoint
  cors: false, // remove Apollo Cors-config, since there is one already
});

export const registerExpressServer: (app: Express) => ServerRegistration = (
  expressApp
) => registerServer(expressApp);

const buildSchemas = async () => {
  const entityResolvers: NonEmptyArray<Function> = [
    PostResolver,
    UserResolver,
    WineryResolver,
    ServiceResolver,
    PresignedResolver,
    ReservationResolver,
  ];

  return await buildSchema({
    resolvers: entityResolvers,
    validate: false,
    authChecker: keycloakAuthChecker,
  });
};

/*interface CustomContextRedis extends ExpressContext {
    redisContext: Redis;
}*/

export type ApolloRedisContext = {
  req: Request;
  res: Response;
  redis: Redis;
};

interface CustomContextKeycloak extends ExpressContext {
  keycloak: Keycloak;
}

export type ApolloKeycloakContext = {
  req: Request;
  res: Response;
  kauth: KeycloakContext;
};

/*const buildRedisExpressContext: ContextFunction<CustomContextRedis, ApolloRedisContext> =
    (customContext) =>
        ({
            req: customContext.req,
            res: customContext.res,
            redis: customContext.redisContext
        });*/
/*export const apolloExpressRedisContext =
    async (redisClient: RedisType): Promise<ApolloServerExpressConfig> => {
    const graphqlSchemas = await buildSchemas();
    const playGroundConfig: PlaygroundConfig = process.env.NODE_ENV === 'production'
        ? {
            settings: {
                //default is 'omit'
                // Always same credentials for multiple-playground requests in Dev mode.
                'request.credentials': 'include',
            },
        } // same is an not prod. Change to false
        : {
            settings: {
                //default is 'omit'
                // Always same credentials for multiple-playground requests in Dev mode.
                'request.credentials': 'include',
            },
        };
    return {
        schema: graphqlSchemas,
        context: ({req, res}) =>
            buildRedisExpressContext({req, res, redisContext: redisClient}),
        playground: playGroundConfig,
    }
}*/

const keycloakContext: ContextFunction<
  CustomContextKeycloak,
  ApolloKeycloakContext
> = (customContext) => ({
  req: customContext.req,
  res: customContext.res,
  kauth: new KeycloakContext(
    { req: customContext.req as GrantedRequest },
    customContext.keycloak
  ),
});

export const apolloKeycloakExpressContext = async (
  keycloak: Keycloak
): Promise<ApolloServerExpressConfig> => {
  const graphqlSchemas = await buildSchemas();
  const playGroundConfig: PlaygroundConfig =
    process.env.NODE_ENV === "production"
      ? {
          settings: {
            //default is 'omit'
            // Always same credentials for multiple-playground requests in Dev mode.
            "request.credentials": "include",
          },
        } // same is an not prod. Change to false
      : {
          settings: {
            //default is 'omit'
            // Always same credentials for multiple-playground requests in Dev mode.
            "request.credentials": "include",
          },
        };
  return {
    schema: graphqlSchemas,
    context: ({ req, res }) => {
      return keycloakContext({ req: req, res: res, keycloak });
    },
    playground: playGroundConfig,
    typeDefs: [KeycloakTypeDefs],
    schemaDirectives: KeycloakSchemaDirectives,
  };
};
