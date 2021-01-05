import {Query, Resolver} from "type-graphql";
import {WineEvent} from "../../entities/WineEvent";
import {WineEventResponse} from "./wineEventResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";

@Resolver(WineEvent)
export class WineEventResolver {

    @Query(() => WineEventResponse)
    async allWineEvents(): Promise<WineEventResponse> {
        const wineEventDB = await WineEvent.findOne();
        if (wineEventDB !== undefined) {
            return {wineEvents: [wineEventDB]};
        } else {
            const fieldError: FieldError = {
                field: "allWineEvents",
                message: "All wine events finding returns undefined"
            }
            return {
                errors: [fieldError]
            }
        }
    }

}