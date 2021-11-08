import { Int, Query, Resolver } from "type-graphql";
import { Reservation } from "../entities/Reservation";

@Resolver(Reservation)
export class ReservationResolvers {
  @Query(() => Int)
  async allReservations() {
    return 0;
  }
}
