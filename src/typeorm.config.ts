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
import {FrequencyRule} from "./entities/FrequencyRule";

export default {
    type: 'postgres',
    database: 'db-vinplan',
    port: 5433,
    logging: true, // log SQL
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote, Service, Winery,ServiceReservation, WineProductionType, WineType, FrequencyRule]
} as ConnectionOptions