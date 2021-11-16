import { Field, ObjectType } from "type-graphql";
import { PaymentMetadata } from "./PaymentMetadata";

@ObjectType()
export class Customer {
  @Field()
  email: string;

  @Field(() => PaymentMetadata)
  paymentMetadata: PaymentMetadata;

  @Field({ nullable: true })
  name?: string;
}
