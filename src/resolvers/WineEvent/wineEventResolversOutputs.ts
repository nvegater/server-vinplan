import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {WineEvent} from "../../entities/WineEvent";

@ObjectType()
export class WineEventResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [WineEvent], {nullable: true})
    wineEvents?: WineEvent[]
}