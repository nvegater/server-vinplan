import { Field, ObjectType } from "type-graphql";
import { Tier } from "./Tier";

@ObjectType()
export class Price {
  @Field()
  id: string;
  @Field()
  type: string;
  @Field()
  currency: string;
  @Field(() => String, { nullable: true })
  tiersMode?: string | null;

  @Field(() => [Tier], { nullable: true })
  tiers?: Tier[];
}
