import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class PresignedResponse {
  @Field(() => String, { nullable: true })
  getUrl: String;
  @Field(() => String, { nullable: true })
  putUrl: String;
}

@ObjectType()
export class GetPreSignedUrlResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [PresignedResponse], { nullable: true })
  arrayUrl?: PresignedResponse[];
}
