import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";

@ObjectType()
export class PresignedResponse {
    @Field(() => String)
    getUrl?: String
    @Field(() => String)
    putUrl?: String
}

@ObjectType()
export class GetPreSignedUrlResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => String)
    getUrl?: String
    @Field(() => String)
    putUrl?: String
    @Field(() => PresignedResponse)
    arrayUrl?: PresignedResponse
}