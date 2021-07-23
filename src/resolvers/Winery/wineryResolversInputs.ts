import {Field, InputType} from "type-graphql";
import {Winery} from "../../entities/Winery"

@InputType()
export class UpdateWineryInputs extends Winery{
    @Field()
    younerFriendly!: boolean;
    @Field()
    petFriendly!: boolean;
}