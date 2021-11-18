import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Price {
  @Field()
  id: string;
  @Field()
  type: string;
  @Field()
  currency: string;
  @Field({ nullable: true })
  tiersMode?: string | null;
}
