import { Int, Mutation, Query, Resolver } from "type-graphql";
import { Reservation } from "../entities/Reservation";
import { reservation } from "../useCases/reservations";

@Resolver(Reservation)
export class ReservationResolvers {
  @Query(() => Int)
  async allReservations() {
    return 0;
  }

  @Mutation(() => Boolean)
  async reserveAsGuest() {
    return reservation();
  }
}
