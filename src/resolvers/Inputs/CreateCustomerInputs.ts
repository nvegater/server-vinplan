import { Field, InputType } from "type-graphql";

@InputType()
export class PaymentMetadataInputs {
  @Field()
  username: string;
}

@InputType({
  description:
    "If customer has metadata, it means it is a registered user and It has an username." +
    "But Customers dont need to be registered. They can book events as guests, thats why the metadata prop is nullable",
})
export class CreateCustomerInputs {
  @Field()
  email: string;
  @Field(() => PaymentMetadataInputs, { nullable: true })
  paymentMetadata: PaymentMetadataInputs | null;
}
