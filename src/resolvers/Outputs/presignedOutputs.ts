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

@ObjectType()
export class InsertImageResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [String], { nullable: true })
  imageKeys?: string[];
}

@ObjectType()
export class GetImage {
  @Field(() => String)
  imageKey: string;
  @Field(() => String)
  getUrl: string;
}

@ObjectType()
export class ImageGalleryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [GetImage], { nullable: true })
  gallery?: GetImage[];
}
