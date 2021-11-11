import { Field, InputType } from "type-graphql";

@InputType()
export class UserInputs {
  @Field()
  username: string;
  @Field()
  email: string;
}
