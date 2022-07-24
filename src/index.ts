import express, { Express, RequestHandler } from "express";
import "reflect-metadata";
// Read dotenv file and stick them as variables and throw error if an environment variable is not set
import "dotenv-safe/config";

import cors from "cors";
import { corsConfig } from "./express-config";

import { createConnection } from "typeorm";
import typeOrmPostgresConfig from "./typeorm.config";

import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import { configureApolloServer, registerExpressServer } from "./apollo-config";

import { raw } from "body-parser";

import { webhookListenerFn } from "./dataServices/payment";

const start_server = async () => {
  const app: Express = express();

  // CORS
  const corsRequestHandler: RequestHandler = cors(corsConfig);
  app.use(corsRequestHandler);

  app.set("trust proxy", 1);

  // TypeORM
  await createConnection(typeOrmPostgresConfig);

  const apolloConfig: ApolloServerExpressConfig = await configureApolloServer();

  new ApolloServer(apolloConfig).applyMiddleware(registerExpressServer(app));

  app.post("/webhook", raw({ type: "application/json" }), (req, res) =>
    webhookListenerFn(req, res)
  );

  // Start server
  app.listen(process.env.PORT, () => {
    console.log("Server started in port " + process.env.PORT);
  });
};

start_server().catch((err) => {
  console.log(err);
});
