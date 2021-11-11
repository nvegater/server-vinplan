import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { ProductionType, WineProductionType } from "./WineProductionType";
import { TypeWine, WineType } from "./WineType";
import { Amenity, WineryAmenity } from "./WineryAmenity";
import { WineryLanguage, SupportedLanguage } from "./WineryLanguage";
import { Grape, WineGrapesProduction } from "./WineGrapesProduction";
import { OtherServices, WineryOtherServices } from "./WineryOtherServices";
import { Experience } from "./Experience";

export enum Valley {
  "GUADALUPE" = "Guadalupe",
  "SAN_ANT_MINAS" = "San Antonio de las Minas",
  "ENSENADA" = "Ensenada",
  "SANTO_TOMAS" = "Santo Tomas",
  "OJOS_NEGROS" = "Ojos Negros",
  "GRULLA" = "La Grulla",
  "SAN_VICENTE" = "San Vicente",
  "SAN_QUINTIN" = "San Quintín",
  "CALAFIA" = "Calafia",
}

registerEnumType(Valley, {
  name: "Valley",
  description:
    "A winery is in an unique valley, valleys are not identifiable through addresses",
});
@ObjectType()
@Entity()
export class Winery extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Field(() => String)
  @Column({ unique: true })
  creatorUsername!: string;

  @Field(() => String)
  @Column({ unique: true })
  creatorEmail!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  foundationYear: number;

  // Winery posts multiple wineEvents. Each wineEvent done by user.
  @Field(() => [Experience], { nullable: true })
  @OneToMany(() => Experience, (exp) => exp.winery)
  experiences: Experience[];

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  googleMapsUrl: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  yearlyWineProduction: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactEmail: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactPhoneNumber: string;

  @Field({ nullable: true })
  @Column({ default: false, nullable: false })
  verified: boolean;

  @Field({ nullable: true })
  @Column({ default: false, nullable: false })
  covidLabel: boolean;

  @Field({ nullable: true })
  urlImageCover: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  productRegion: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postalAddress: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  architecturalReferences: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  younerFriendly: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  petFriendly: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  enologoName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  handicappedFriendly: boolean;

  @Field(() => [Grape], { nullable: true })
  @OneToMany(
    () => WineGrapesProduction,
    (wineGrapesProduction) => wineGrapesProduction.winery
  )
  wineGrapesProduction: Grape[];

  @Field(() => [ProductionType], { nullable: true })
  @OneToMany(
    () => WineProductionType,
    (wineProductionType) => wineProductionType.winery
  )
  productionType: WineProductionType[];

  @Field(() => [OtherServices], { nullable: true })
  @OneToMany(
    () => WineryOtherServices,
    (wineryOtherServices) => wineryOtherServices.winery
  )
  othersServices: OtherServices[];

  @Field(() => Valley)
  @Column("enum", { name: "valley", enum: Valley })
  valley: Valley;

  @Field(() => [TypeWine], { nullable: true })
  @OneToMany(() => WineType, (wineType) => wineType.winery)
  wineType: WineType[];

  @Field(() => [SupportedLanguage], { nullable: true })
  @OneToMany(
    () => WineryLanguage,
    (serviceLanguage) => serviceLanguage.winery,
    { nullable: true }
  )
  supportedLanguages?: WineryLanguage[];

  @Field(() => [Amenity], { nullable: true })
  @OneToMany(() => WineryAmenity, (wineryAmenity) => wineryAmenity.winery, {
    nullable: true,
  })
  amenities?: WineryAmenity[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
