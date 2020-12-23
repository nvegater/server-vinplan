import {Post} from "./entities/Post";
import {User} from "./entities/User";
import {ConnectionOptions} from "typeorm";
import path from "path";

export default {
    type: 'postgres',
    database: 'db-vinplan',
    port: 5433,
    logging: true, // log SQL
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User]
} as ConnectionOptions