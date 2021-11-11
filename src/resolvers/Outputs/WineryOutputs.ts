import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Winery } from "../../entities/Winery";

@ObjectType()
export class WineryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Winery, { nullable: true })
  winery?: Winery;
}
