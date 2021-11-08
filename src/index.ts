import express, { Express, RequestHandler } from "express";
import "reflect-metadata";
// Read dotenv file and stick them as variables and throw error if an environment variable is not set
import "dotenv-safe/config";

import cors from "cors";
import { corsConfig } from "./express-config";

import expSession from "express-session";

import { Connection, createConnection } from "typeorm";
import typeOrmPostgresConfig from "./typeorm.config";

import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import {
  apolloKeycloakExpressContext,
  registerExpressServer,
} from "./apollo-config";

import Keycloak from "keycloak-connect";

import keycloakConfig from "./keycloak.json";

const start_server = async () => {
  const app: Express = express();

  // CORS
  const corsRequestHandler: RequestHandler = cors(corsConfig);
  app.use(corsRequestHandler);

  app.set("trust proxy", 1);

  // TypeORM
  const postgresConnection: Connection = await createConnection(
    typeOrmPostgresConfig
  );
  // when pushing the docker image
  // this will run everything from the migration folder
  await postgresConnection.runMigrations();

  //await Post.delete({});
  // npx typeorm migration:create -n FakePosts <----for migrations

  // Keycloak
  const memoryStore = new expSession.MemoryStore();

  app.use(
    expSession({
      secret: process.env.KEYCLOAK_SECRET || "",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

  app.use(keycloak.middleware({ admin: "/graphql" }));
  app.use("/graphql", keycloak.middleware());

  const apolloKeycloakConfig: ApolloServerExpressConfig =
    await apolloKeycloakExpressContext();

  new ApolloServer(apolloKeycloakConfig).applyMiddleware(
    registerExpressServer(app)
  );

  // Start server
  app.listen(process.env.PORT, () => {
    console.log("Server started in localhost: 4000");
  });
};

start_server().catch((err) => {
  console.log(err);
});
