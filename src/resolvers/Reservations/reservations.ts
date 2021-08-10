import {Arg, Ctx, Int, Query, Resolver} from "type-graphql";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {getConnection} from "typeorm";
import {SQL_QUERY_SELECT_RESERVATIONS_WITH_USER_AND_SERVICE} from "../Universal/queries";
import {FieldError} from "../User/userResolversOutputs";
import {ReservationResponse} from "./reservationsOutputs";
import {ApolloRedisContext} from "../../apollo-config";
import getUserReservations from "../../useCases/reservation/getUserReservations";
import getWineryReservations from "../../useCases/reservation/getWineryReservations";
// import {ReservationsWinery} from "../../resolvers/Reservations/reservationsOutputs"

@Resolver(ServiceReservation)
export class ReservationResolver {
    @Query(() => ReservationResponse)
    async allReservations(
        @Arg('limit', () => Int, {
            description: "For pagination." +
                "Max number of reservations. Default is 50"
        }) limit: number
    ): Promise<ReservationResponse> {
        const realLimit = Math.min(50, limit);
        const replacements = [realLimit + 1]
        const paginatedReservations = await getConnection()
            .query(SQL_QUERY_SELECT_RESERVATIONS_WITH_USER_AND_SERVICE, replacements);

        if (paginatedReservations !== undefined) {
            return {
                reservations: paginatedReservations.slice(0, realLimit),
                moreReservationsAvailable: paginatedReservations.length === (realLimit + 1) // DB has more posts than requested
            };
        } else {
            const fieldError: FieldError = {
                field: "allReservations",
                message: "Not returing anything that makes sense"
            }
            return {
                errors: [fieldError],
                moreReservationsAvailable: false
            }
        }
    };

    @Query(() => [ServiceReservation])
    async userReservations(
        @Ctx() {req}: ApolloRedisContext
    ): Promise<ServiceReservation[]> {
        // @ts-ignore
        const {userId} = req.session;
        return await getUserReservations(userId)
    }

    @Query(() => [ServiceReservation])
    async wineryReservations(
        @Arg('wineryId', () => Int) wineryId: number
    ):  Promise<ServiceReservation[]>{
      return await getWineryReservations(wineryId)
    }

}