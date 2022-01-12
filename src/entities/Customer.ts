import { Field, ObjectType } from "type-graphql";
import { PaymentMetadata } from "./PaymentMetadata";

// If customer has metadata, it means it is a registered user and It has an username
// But Customers dont need to be registered. They can book events as guests
@ObjectType({
  description:
    "If customer has metadata, it means it is a registered user and It has an username." +
    "But Customers dont need to be registered. They can book events as guests, thats why the metadata prop is nullable",
})
export class Customer {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => PaymentMetadata, { nullable: true })
  paymentMetadata: PaymentMetadata | null;
}
