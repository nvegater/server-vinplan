import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Tier {
  @Field(() => Number, { nullable: true })
  flat_amount?: number | null;

  @Field(() => String, { nullable: true })
  flat_amount_decimal: string | null;

  @Field(() => Number, { nullable: true })
  unit_amount?: number | null;

  @Field(() => String, { nullable: true })
  unit_amount_decimal: string | null;

  @Field(() => Number, { nullable: true })
  up_to?: number | null;
}
