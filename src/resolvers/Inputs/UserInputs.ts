import { Field, InputType } from "type-graphql";

@InputType()
export class UserInputs {
  @Field()
  username: string;
  @Field()
  email: string;
}

@InputType()
export class GetWineryInputs {
  @Field({ nullable: true })
  urlAlias?: string;
  @Field({ nullable: true })
  creatorUsername?: string;
}
