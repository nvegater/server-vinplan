import {Post} from "./entities/Post";
import {User} from "./entities/User";
import {Upvote} from "./entities/Upvote";
import {ConnectionOptions} from "typeorm";
import path from "path";
import {Service} from "./entities/Service";
import {Winery} from "./entities/Winery";
import {ServiceReservation} from "./entities/ServiceReservation";
import {WineProductionType} from "./entities/WineProductionType";
import {WineType} from "./entities/WineType";

export default {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true, // log SQL
    //synchronize: true, // dont set in production npx typeorm migration:create -n InitialDBSetup
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote, Service, Winery,ServiceReservation, WineProductionType, WineType]
} as ConnectionOptions