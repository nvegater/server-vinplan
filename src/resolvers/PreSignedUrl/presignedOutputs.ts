import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";

@ObjectType()
export class PresignedResponse {
    @Field(() => String,{nullable:true})
    getUrl: String
    @Field(() => String,{nullable:true})
    putUrl: String
}

@ObjectType()
export class GetPreSignedUrlResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [PresignedResponse],{nullable:true})
    arrayUrl?: PresignedResponse[]
}