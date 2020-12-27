import {Post} from "./entities/Post";
import {User} from "./entities/User";
import {Upvote} from "./entities/Upvote";
import {ConnectionOptions} from "typeorm";
import path from "path";

export default {
    type: 'postgres',
    database: 'db-vinplan',
    port: 5433,
    logging: true, // log SQL
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote]
} as ConnectionOptions