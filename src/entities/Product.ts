import { Field, ObjectType } from "type-graphql";
import { Price } from "./Price";

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  images: string[];

  @Field(() => String)
  unit_label: string;

  @Field(() => [Price])
  price: Price[];
}
