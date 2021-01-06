import {Field, ObjectType} from "type-graphql";
import {FieldError} from "../User/userResolversOutputs";
import {Winery} from "../../entities/Winery";
import {WineEvent} from "../../entities/WineEvent";

@ObjectType()
export class WineriesResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => [Winery], {nullable: true})
    paginatedWineries?: Winery[];
    @Field()
    moreWineriesAvailable: boolean;
}

@ObjectType()
export class WineryEventsResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => Winery)
    winery?: Winery;
    @Field(()=>[WineEvent])
    events?: WineEvent[];
}