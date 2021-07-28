import {Field, InputType, registerEnumType} from "type-graphql";

const UPLOAD_TYPE_DESCRIPTION = `Se pueden cargar imagenes para distintos elementos, usuarios, galerias de viñeros etc, etc`

export enum UploadType {
    WINERYALBUM = "winerybook",
    USERPROFILEPICTURE = "userprofilepicture",
    SERVICEALBUM = "servicealbum",
    WINERYLOGO = "winerylogo",
}

registerEnumType(UploadType, {name : "UploadType", description: UPLOAD_TYPE_DESCRIPTION})
@InputType()
export class PresignedUrlInput {
    @Field(() => [String])
    fileName: string[]
    @Field(() => UploadType)
    uploadType : UploadType
    @Field({ nullable: true, description: 'opcional' })
    wineryId: number
    @Field({ nullable: true, description: 'opcional' })
    serviceId: number
    @Field({ nullable: true, description: 'opcional'})
    userId: number
}