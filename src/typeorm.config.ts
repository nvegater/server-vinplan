import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Upvote } from "./entities/Upvote";
import { ConnectionOptions } from "typeorm";
import path from "path";
import { Service } from "./entities/Service";
import { Winery } from "./entities/Winery";
import { ServiceReservation } from "./entities/ServiceReservation";
import { WineProductionType } from "./entities/WineProductionType";
import { WineType } from "./entities/WineType";
import { WineryAmenity } from "./entities/WineryAmenity";
import { WineryLanguage } from "./entities/WineryLanguage";
import { WineryImageGallery } from "./entities/WineryImageGallery";
import { ServiceImageGallery } from "./entities/ServiceImageGallery";
import { ServiceDefaultImage } from "./entities/ServiceDefaultImage";
import { WineGrapesProduction } from "./entities/WineGrapesProduction";
import { WineryOtherServices } from "./entities/WineryOtherServices";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true, // log SQL
  synchronize: false,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [
    Post,
    User,
    Upvote,
    Service,
    Winery,
    ServiceReservation,
    WineProductionType,
    WineType,
    WineryAmenity,
    WineryLanguage,
    WineryImageGallery,
    WineGrapesProduction,
    WineryOtherServices,
    ServiceImageGallery,
    ServiceDefaultImage,
  ],
} as ConnectionOptions;
