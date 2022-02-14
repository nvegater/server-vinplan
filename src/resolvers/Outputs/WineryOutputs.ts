import { Field, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Valley } from "../../entities/Winery";
import { ProductionType } from "../../entities/WineProductionType";
import { TypeWine } from "../../entities/WineType";
import { SupportedLanguage } from "../../entities/WineryLanguage";
import { Amenity } from "../../entities/WineryAmenity";

@ObjectType()
export class WineryDts {
  @Field(() => Int)
  id!: number;
  @Field(() => String)
  name: string;
  @Field(() => String)
  urlAlias: string;
  @Field(() => String, { nullable: true })
  stripe_customerId: string;
  @Field(() => String, { nullable: true })
  subscription: string;
  @Field(() => String, { nullable: true })
  accountId?: string;
  @Field(() => Number, { nullable: true })
  accountCreatedTime?: number;
  @Field(() => String)
  creatorUsername: string;
  @Field(() => String)
  creatorEmail: string;
  @Field(() => String)
  description: string;
  @Field(() => Int, { nullable: true })
  foundationYear: number;
  @Field(() => String, { nullable: true })
  googleMapsUrl: string;
  @Field(() => Int, { nullable: true })
  yearlyWineProduction: number;
  @Field({ nullable: true })
  covidLabel: boolean;
  @Field(() => [ProductionType], { nullable: true })
  productionType: ProductionType[];
  @Field(() => Valley)
  valley: Valley;
  @Field(() => [TypeWine], { nullable: true })
  wineType: TypeWine[];
  @Field(() => [SupportedLanguage], { nullable: true })
  supportedLanguages?: SupportedLanguage[];
  @Field(() => [Amenity], { nullable: true })
  amenities?: Amenity[];
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class WineryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => WineryDts, { nullable: true })
  winery?: WineryDts;
  @Field(() => String, { nullable: true })
  sessionUrl?: string;
}
