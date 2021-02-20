import express, {Express, RequestHandler} from "express";
import "reflect-metadata"
// Read dotenv file and stick them as variables and throw error if an environment variable is not set
import "dotenv-safe/config"

import cors from "cors"
import {corsConfig} from "./express-config";

import session from 'express-session';
import connectRedis, {RedisStore} from 'connect-redis';
import Redis, {Redis as RedisType} from 'ioredis';
import {buildRedisSession} from "./redis-config";

import {Connection, createConnection} from "typeorm";
import typeOrmPostgresConfig from "./typeorm.config"

import {ApolloServer} from "apollo-server-express";
import {
    registerExpressServer,
    apolloExpressRedisContext
} from "./apollo-config";
import {ApolloServerExpressConfig} from "apollo-server-express/dist/ApolloServer";


const start_server = async () => {

    const app: Express = express();

    // CORS
    const corsRequestHandler: RequestHandler = cors(corsConfig);
    app.use(corsRequestHandler)

    // Redis
    const redisStore: RedisStore = connectRedis(session)
    const redisClient: RedisType = new Redis(process.env.REDIS_URL)
    app.set("trust proxy", 1);
    const redisRequestHandler: RequestHandler = session(buildRedisSession(redisStore, redisClient));
    app.use(redisRequestHandler);

    // TypeORM
    const postgresConnection:Connection = await createConnection(typeOrmPostgresConfig);
    // when pushing the docker image
    // this will run everything from the migration folder
    await postgresConnection.runMigrations();

    //await Post.delete({});
    // npx typeorm migration:create -n FakePosts <----for migrations

    // Apollo
    const apolloConfig: ApolloServerExpressConfig = await apolloExpressRedisContext(redisClient);

    new ApolloServer(apolloConfig)
        .applyMiddleware(registerExpressServer(app))

    // Start server
    app.listen(process.env.PORT, () => {
        console.log("Server started in localhost: 4000");
    })
}

start_server()
    .catch((err) => {
        console.log(err)
    });
