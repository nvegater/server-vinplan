import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
import { buildSchema } from "type-graphql";
import { Express } from "express";
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
import { ExperienceResolvers } from "./resolvers/ExperienceResolvers";
import { ReservationResolvers } from "./resolvers/ReservationResolvers";
import { WineryResolvers } from "./resolvers/WineryResolvers";
import { keycloakAuthChecker } from "./utils/auth/keycloak";
import { CustomerResolvers } from "./resolvers/CustomerResolvers";
import { PresignedResolver } from "./resolvers/PresignedUrlsResolvers";
import { _prod_ } from "./constants";

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
    ExperienceResolvers,
    PresignedResolver,
    ReservationResolvers,
    WineryResolvers,
    CustomerResolvers,
  ];

  return await buildSchema({
    resolvers: entityResolvers,
    validate: false,
    authChecker: keycloakAuthChecker,
  });
};

export type ApolloKeycloakContext = {
  kauth: KeycloakContext;
};

export const apolloKeycloakExpressContext =
  async (): Promise<ApolloServerExpressConfig> => {
    const graphqlSchemas = await buildSchemas();
    const playGroundConfig: PlaygroundConfig =
      process.env.NODE_ENV === "production"
        ? false
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
      introspection: !_prod_,
    };
  };
