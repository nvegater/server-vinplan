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
import {WineryAmenity} from "./entities/WineryAmenity";
import {WineryLanguage} from "./entities/WineryLanguage";

export default {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    logging: true, // log SQL
    synchronize: false, // npx typeorm migration:create -n InitialDBSetup
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Upvote, Service, Winery,ServiceReservation, WineProductionType, WineType, WineryAmenity, WineryLanguage]
} as ConnectionOptions
