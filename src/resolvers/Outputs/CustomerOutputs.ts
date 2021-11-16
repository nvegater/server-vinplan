import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";
import { Customer } from "../../entities/Customer";

@ObjectType()
export class CustomerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Customer, { nullable: true })
  customer?: Customer;
}
