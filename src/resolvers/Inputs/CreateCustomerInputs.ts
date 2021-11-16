import { Field, InputType } from "type-graphql";

@InputType()
export class PaymentMetadataInputs {
  @Field()
  username: string;
}

@InputType()
export class CreateCustomerInputs {
  @Field()
  email: string;
  @Field(() => PaymentMetadataInputs)
  paymentMetadata: PaymentMetadataInputs;
}
