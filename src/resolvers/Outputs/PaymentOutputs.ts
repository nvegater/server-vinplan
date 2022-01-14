import { Field, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Product } from "../../entities/Product";

@ObjectType()
export class ProductsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [Product], { nullable: true })
  products?: Product[];
}

@ObjectType()
export class CustomerDts {
  @Field()
  id: string;
  @Field()
  stripeCustomerId: string;
  @Field()
  email: string;
  @Field(() => String, {
    nullable: true,
  })
  username: string | null;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class CustomerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => CustomerDts, { nullable: true })
  customer?: CustomerDts;
}

@ObjectType()
export class CheckoutSessionResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  payment_status?: string | null;
  @Field(() => [Int], { nullable: true })
  reservationIds?: number[] | null;
}

@ObjectType()
export class CheckoutLinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  link?: string | null;
}

@ObjectType()
export class OnboardingResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => String, { nullable: true })
  accountLinkUrl?: string;
}
