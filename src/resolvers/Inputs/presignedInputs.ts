import { Field, InputType, registerEnumType } from "type-graphql";

const UPLOAD_TYPE_DESCRIPTION = `Se pueden cargar imagenes para distintos elementos, usuarios, galerias de viñeros etc, etc`;

export enum UploadType {
  WINERY_PIC,
  WINERY_LOGO,
  USER_PIC,
}

registerEnumType(UploadType, {
  name: "UploadType",
  description: UPLOAD_TYPE_DESCRIPTION,
});
@InputType()
export class PresignedUrlInput {
  @Field(() => [String])
  fileNames: string[];
  @Field(() => UploadType)
  uploadType: UploadType;
  @Field({ nullable: true, description: "opcional" })
  wineryId: number;
  @Field(() => String, { nullable: true, description: "opcional" })
  wineryAlias: string;
  @Field(() => String, { nullable: true, description: "opcional" })
  creatorUsername: string;
}
