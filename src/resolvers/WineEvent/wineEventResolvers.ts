import {Arg, Int, Query, Resolver} from "type-graphql";
import {WineEvent} from "../../entities/WineEvent";
import {WineEventResponse} from "./wineEventResolversOutputs";
import {FieldError} from "../User/userResolversOutputs";
import {getConnection} from "typeorm";
import {SQL_QUERY_SELECT_WINE_EVENTS_WITH_WINERY} from "../Universal/queries";

@Resolver(WineEvent)
export class WineEventResolver {

    @Query(() => WineEventResponse)
    async allWineEvents(
        @Arg('limit', () => Int, {
            description: "For pagination." +
                "Max number of posts. Default is 50"
        }) limit: number
    ): Promise<WineEventResponse> {
        const realLimit = Math.min(50, limit);
        const replacements = [realLimit+1]
        const paginatedEventsDB = await getConnection()
            .query(SQL_QUERY_SELECT_WINE_EVENTS_WITH_WINERY, replacements);

        if (paginatedEventsDB !== undefined) {
            return {
                paginatedEvents: paginatedEventsDB.slice(0,realLimit),
                moreEventsAvailable: paginatedEventsDB.length === (realLimit + 1) // DB has more posts than requested
            };
        } else {
            const fieldError: FieldError = {
                field: "allWineEvents",
                message: "All wine events finding returns undefined"
            }
            return {
                errors: [fieldError],
                moreEventsAvailable: false
            }
        }
    }

}