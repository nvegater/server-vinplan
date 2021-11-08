import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
import { PostResolver } from "./resolvers/Post/postResolvers";
import { UserResolver } from "./resolvers/User/userResolvers";
import { buildSchema } from "type-graphql";
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
  PlaygroundConfig,
  ServerRegistration,
} from "apollo-server-express";
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

export type ApolloRedisContext = {
  req: Request;
  res: Response;
  redis: any;
};

export type ApolloKeycloakContext = {
  kauth: KeycloakContext;
};

export const apolloKeycloakExpressContext =
  async (): Promise<ApolloServerExpressConfig> => {
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
      context: ({ req }) => {
        return {
          kauth: new KeycloakContext({ req: req as GrantedRequest }),
        };
      },
      playground: playGroundConfig,
      typeDefs: [KeycloakTypeDefs],
      schemaDirectives: KeycloakSchemaDirectives,
    };
  };
