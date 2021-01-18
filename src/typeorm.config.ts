import {Post} from "./entities/Post";
import {User} from "./entities/User";
import {Upvote} from "./entities/Upvote";
import {ConnectionOptions} from "typeorm";
import path from "path";
import {WineEvent} from "./entities/WineEvent";
import {Winery} from "./entities/Winery";
import {ServiceReservation} from "./entities/ServiceReservation";

export default {
    type: 'postgres',
    database: 'db-vinplan',
    port: 5433,
    logging: true, // log SQL
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote, WineEvent, Winery,ServiceReservation]
} as ConnectionOptions