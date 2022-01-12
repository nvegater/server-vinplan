import { ConnectionOptions } from "typeorm";
import path from "path";
import { Winery } from "./entities/Winery";
import { WineProductionType } from "./entities/WineProductionType";
import { WineType } from "./entities/WineType";
import { WineryAmenity } from "./entities/WineryAmenity";
import { WineryLanguage } from "./entities/WineryLanguage";
import { WineGrapesProduction } from "./entities/WineGrapesProduction";
import { WineryOtherServices } from "./entities/WineryOtherServices";
import { Experience } from "./entities/Experience";
import { Reservation } from "./entities/Reservation";
import { ExperienceImage, WineryImage, UserImage } from "./entities/Images";
import { ExperienceSlot } from "./entities/ExperienceSlot";
import { Customer } from "./entities/Customer";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true, // log SQL
  synchronize: false,
  migrations: [path.join(__dirname, "./migrations/*")],
  migrationsRun: true,
  entities: [
    Winery,
    Experience,
    ExperienceSlot,
    Reservation,
    Customer,
    //
    WineProductionType,
    WineType,
    WineryAmenity,
    WineryLanguage,
    WineGrapesProduction,
    WineryOtherServices,
    //
    ExperienceImage,
    WineryImage,
    UserImage,
  ],
} as ConnectionOptions;
