import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Customer } from "../../entities/Customer";
import { Product } from "../../entities/Product";

@ObjectType()
export class ProductsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Product], { nullable: true })
  products?: Product[];
}

@ObjectType()
export class CustomerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Customer, { nullable: true })
  customer?: Customer;
}

@ObjectType()
export class CheckoutSessionResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  sessionStatus?: string;

  @Field(() => String, { nullable: true })
  sessionUrl?: string;
}
