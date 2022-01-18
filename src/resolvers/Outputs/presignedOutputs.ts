import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";

@ObjectType()
export class PresignedResponse {
  @Field(() => String, { nullable: true })
  getUrl?: String;
  @Field(() => String, { nullable: true })
  putUrl?: String;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class GetPreSignedUrlResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [PresignedResponse], { nullable: true })
  arrayUrl?: PresignedResponse[];
}
