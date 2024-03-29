import { Field, Int, ObjectType } from "type-graphql";
import { FieldError } from "./ErrorOutputs";

@ObjectType()
export class PresignedResponse {
  @Field(() => String, { nullable: true })
  getUrl?: String;
  @Field(() => String, { nullable: true })
  putUrl?: String;
  @Field(() => String)
  imageName?: string;
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
export class GetImage {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  imageName: string;
  @Field(() => String)
  getUrl: string;
}

@ObjectType()
export class InsertImageResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [GetImage], { nullable: true })
  images?: GetImage[];
}

@ObjectType()
export class ImageGalleryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [GetImage], { nullable: true })
  gallery?: GetImage[];
}
