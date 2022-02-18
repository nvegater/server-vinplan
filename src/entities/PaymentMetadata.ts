import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaymentMetadata {
  @Field()
  username: string;
}
