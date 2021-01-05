import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {Winery} from "../../entities/Winery";

@ObjectType()
export class WineryResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [Winery], {nullable: true})
    winery?: Winery[]
}