import { Field, ObjectType } from "type-graphql";
import { User } from "../../entities/User";
import { Winery } from "../../entities/Winery";

/**
 * This file is for return values of resolvers related to an user
 * **/
@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class SendUserValidationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Boolean, { nullable: true })
  send?: Boolean;
}

@ObjectType()
export class WineryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  winery?: Winery;
}
