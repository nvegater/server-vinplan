import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";

@ObjectType()
export class WineryGetPreSignedUrlResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => String)
    putUrl?: String;
    @Field(() => String)
    getUrl?: String;
}