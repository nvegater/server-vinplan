import path from "path";
import {DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait} from "testcontainers"
import Redis, {Redis as RedisType} from 'ioredis';
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {Connection, createConnection} from "typeorm";
import {Post} from "../../entities/Post";
import {User} from "../../entities/User";
import {Upvote} from "../../entities/Upvote";
import {Service} from "../../entities/Service";
import {Winery} from "../../entities/Winery";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineType} from "../../entities/WineType";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryImageGallery} from "../../entities/WineryImageGallery";
import {ServiceImageGallery} from "../../entities/ServiceImageGallery";
import connectRedis, {RedisStore} from "connect-redis";
import session from "express-session";
import express, {Express, RequestHandler} from "express";
import {buildRedisSession} from "../../redis-config";
import {ApolloServerExpressConfig} from "apollo-server-express/dist/ApolloServer";
import {apolloExpressRedisContext, registerExpressServer} from "../../apollo-config";
import {ApolloServer} from "apollo-server-express";


jest.setTimeout(30000)

describe("DockerComposeEnvironment", () => {
    let environment: StartedDockerComposeEnvironment;
    let redisClient: RedisType;
    let postgresConnection: Connection;

    beforeAll(async () => {
        const composeFilePath = path.resolve(".");
        const composeFile = "docker-compose.yml";
        environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
            //.withEnv("NEXT_PUBLIC_DO_SPACES_ENDPOINT", "_") only works for env not for app
            .withWaitStrategy("server-vinplan_redis_1", Wait.forLogMessage("Ready to accept connections"))
            .withWaitStrategy("server-vinplan_postgres_1", Wait.forHealthCheck())
            .up();

        console.log(environment)
        // initialize Redis for all tests
        const redisContainer = environment.getContainer("redis_1");
        redisClient = new Redis(6379, redisContainer.getHost())
        //const postgresContainer: StartedGenericContainer = environment.getContainer("postgres_1");

        const postgresTypeOrmContainerConfig: PostgresConnectionOptions = {
            type: 'postgres',
            url: `postgres://root:toor@localhost:5432/vinplan`,
            logging: true, // log SQL
            migrations: [path.join(__dirname, "./migrations/*")],
            entities: [Post, User, Upvote, Service, Winery, ServiceReservation, WineProductionType, WineType, WineryAmenity, WineryLanguage, WineryImageGallery, ServiceImageGallery]
        }

        postgresConnection = await createConnection(postgresTypeOrmContainerConfig);

        console.log(postgresConnection)
    });

    afterAll(async () => {
        await redisClient.quit();
        await environment.down();
    });

    it("setup the redis environment correctly", async () => {
        await redisClient.set("key", "val");
        expect(await redisClient.get("key")).toBe("val");
    });

    it("Initialize App", async () => {
        const app: Express = express();

        const redisStore: RedisStore = connectRedis(session)
        const redisRequestHandler: RequestHandler = session(buildRedisSession(redisStore, redisClient));


        app.use(redisRequestHandler);

        await postgresConnection.runMigrations();

        const apolloConfig: ApolloServerExpressConfig = await apolloExpressRedisContext(redisClient);

        new ApolloServer(apolloConfig)
            .applyMiddleware(registerExpressServer(app))

        console.log(process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT)
        //console.log(process.env.NODE_ENV) this is "test"

        // Start server
        app.listen(process.env.PORT, () => {
            console.log("Server started in localhost: 4000");
        })


    });
});
