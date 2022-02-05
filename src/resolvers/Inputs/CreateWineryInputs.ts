import { Field, InputType, Int } from "type-graphql";
import { Valley } from "../../entities/Winery";
import { ProductionType } from "../../entities/WineProductionType";
import { TypeWine } from "../../entities/WineType";
import { SupportedLanguage } from "../../entities/WineryLanguage";
import { Amenity } from "../../entities/WineryAmenity";

@InputType()
export class CreateWineryInputs {
  @Field()
  name!: string;
  @Field()
  description!: string;
  @Field()
  urlAlias!: string;
  @Field(() => String)
  subscription!: string;
  @Field(() => Valley)
  valley!: Valley;
  @Field(() => [ProductionType])
  productionType!: ProductionType[];
  @Field(() => [TypeWine])
  wineType!: TypeWine[];
  @Field(() => [SupportedLanguage], { nullable: true })
  supportedLanguages?: SupportedLanguage[];
  @Field(() => [Amenity], { nullable: true })
  amenities?: Amenity[];
  @Field(() => Int, { nullable: true })
  yearlyWineProduction?: number;
  // During the creation of the winery, the creator id and user is set after.
  @Field(() => Int, { nullable: true })
  foundationYear?: number;
  @Field(() => String, { nullable: true })
  googleMapsUrl?: string;
  @Field(() => String, { nullable: true })
  contactEmail?: string;
  @Field(() => String, { nullable: true })
  contactPhoneNumber?: string;
  @Field(() => Boolean)
  covidLabel: boolean;
}

@InputType()
export class EditWineryInputs {
  @Field()
  wineryId!: number;
  @Field(() => String, { nullable: true })
  description?: string | null;
  @Field(() => [ProductionType], { nullable: true })
  productionType?: ProductionType[] | null;
  @Field(() => [TypeWine], { nullable: true })
  wineType?: TypeWine[] | null;
  @Field(() => [SupportedLanguage], { nullable: true })
  supportedLanguages?: SupportedLanguage[] | null;
  @Field(() => [Amenity], { nullable: true })
  amenities?: Amenity[] | null;
  @Field(() => Int, { nullable: true })
  yearlyWineProduction?: number | null;
  @Field(() => Int, { nullable: true })
  foundationYear?: number | null;
  @Field(() => String, { nullable: true })
  googleMapsUrl?: string | null;
  @Field(() => String, { nullable: true })
  contactEmail?: string | null;
  @Field(() => String, { nullable: true })
  contactPhoneNumber?: string | null;
  @Field(() => Boolean, { nullable: true })
  covidLabel?: boolean | null;
}
