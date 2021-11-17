import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";

@ObjectType()
export class ProductsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [String], { nullable: true })
  productIds?: string[];
}
