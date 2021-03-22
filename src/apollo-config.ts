import {PlaygroundConfig} from "apollo-server-core/src/playground";
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {PostResolver} from "./resolvers/Post/postResolvers";
import {UserResolver} from "./resolvers/User/userResolvers";
import {buildSchema} from "type-graphql";
import {ApolloServerExpressConfig, ExpressContext} from "apollo-server-express/dist/ApolloServer";
import {Redis as RedisType, Redis} from "ioredis";
import {ContextFunction} from "apollo-server-core";
import {Express, Request, Response} from "express";
import {ServerRegistration} from "apollo-server-express/src/ApolloServer";
import {WineryResolver} from "./resolvers/Winery/wineryResolvers";
import {ServiceResolver} from "./resolvers/Service/serviceResolvers";

const registerServer = (app: Express) => ({
    app, // Http -express server
    path: '/graphql', // Server listen on this endpoint
    cors: false // remove Apollo Cors-config, since there is one already
})

export const registerExpressServer: (app: Express) => ServerRegistration = (expressApp) => registerServer(expressApp);

const buildSchemas = async () => {

    const entityResolvers:
        NonEmptyArray<Function> =
        [
            PostResolver,
            UserResolver,
            WineryResolver,
            ServiceResolver
        ];

    return await buildSchema({
        resolvers: entityResolvers,
        validate: false
    });
}

interface CustomContextRedis extends ExpressContext {
    redisContext: Redis;
}

export type ApolloRedisContext = {
    req: Request;
    res: Response;
    redis: Redis;
}

const buildRedisExpressContext: ContextFunction<CustomContextRedis, ApolloRedisContext> =
    (customContext) =>
        ({
            req: customContext.req,
            res: customContext.res,
            redis: customContext.redisContext
        });

export const apolloExpressRedisContext =
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
}