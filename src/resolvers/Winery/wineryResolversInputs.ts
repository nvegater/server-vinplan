import { Field, InputType } from "type-graphql";
import { Valley } from "../../entities/Winery";
import { ProductionType } from "../../entities/WineProductionType";
import { TypeWine } from "../../entities/WineType";
import { Amenity } from "../../entities/WineryAmenity";
import { SupportedLanguage } from "../../entities/WineryLanguage";
import { Grape } from "../../entities/WineGrapesProduction";
import { OtherServices } from "../../entities/WineryOtherServices";
@InputType()
export class UpdateWineryInputs {
  @Field({ nullable: true, description: "opcional" })
  id: number;
  @Field({ nullable: true, description: "opcional" })
  name?: string;
  @Field({ nullable: true, description: "opcional" })
  description?: string;
  @Field({ nullable: true, description: "opcional" })
  foundationYear?: number;
  @Field({ nullable: true, description: "opcional" })
  googleMapsUrl?: string;
  @Field({ nullable: true, description: "opcional" })
  yearlyWineProduction?: number;
  @Field({ nullable: true, description: "opcional" })
  contactEmail?: string;
  @Field({ nullable: true, description: "opcional" })
  contactPhoneNumber?: string;
  @Field({ nullable: true, description: "opcional" })
  covidLabel?: boolean;
  @Field({ nullable: true, description: "opcional" })
  logo?: string;
  @Field({ nullable: true, description: "opcional" })
  contactName?: string;
  @Field({ nullable: true, description: "opcional" })
  productRegion?: string;
  @Field({ nullable: true, description: "opcional" })
  postalAddress?: string;
  @Field({ nullable: true, description: "opcional" })
  architecturalReferences?: boolean;
  @Field({ nullable: true, description: "opcional" })
  enologoName?: string;
  @Field({ nullable: true, description: "opcional" })
  younerFriendly?: boolean;
  @Field({ nullable: true, description: "opcional" })
  petFriendly?: boolean;
  @Field({ nullable: true, description: "opcional" })
  handicappedFriendly?: boolean;
  @Field(() => [Grape])
  wineGrapesProduction?: Grape[];
  @Field(() => [OtherServices])
  othersServices?: OtherServices[];
  @Field(() => Valley, { nullable: true, description: "opcional" })
  valley?: Valley;
  @Field(() => [ProductionType])
  productionType?: ProductionType[];
  @Field(() => [TypeWine])
  wineType?: TypeWine[];
  @Field(() => [SupportedLanguage])
  supportedLanguages?: SupportedLanguage[];
  @Field(() => [Amenity])
  amenities?: Amenity[];
}
