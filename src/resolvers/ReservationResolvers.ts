import {
  Arg,
  Field,
  Float,
  Int,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Reservation } from "../entities/Reservation";
import {
  getExperienceReservedSlots,
  getReservedSlots,
} from "../useCases/reservations";
import { FieldError } from "./Outputs/ErrorOutputs";
import { ExperienceSlot } from "../entities/ExperienceSlot";

@ObjectType()
export class ReservationDts {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  title: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  username: string | null;
  @Field(() => Int)
  noOfAttendees!: number;
  @Field(() => Float)
  pricePerPersonInDollars!: number;
  @Field()
  paymentStatus: "no_payment_required" | "paid" | "unpaid";
  @Field(() => Int)
  slotId: number;
  @Field(() => Date)
  startDateTime: Date;
  @Field(() => Date)
  endDateTime: Date;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  wineryName: string;
  @Field(() => String, { nullable: true })
  getUrl?: string;
}

@ObjectType()
export class SlotReservations {
  @Field(() => ExperienceSlot)
  slot: ExperienceSlot;
  @Field(() => [ReservationDts])
  reservations: ReservationDts[];
}

@ObjectType()
export class ReservedSlotsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [SlotReservations])
  slotReservations?: SlotReservations[];
}

@Resolver(Reservation)
export class ReservationResolvers {
  @Query(() => ReservedSlotsResponse)
  async reservedSlots(
    @Arg("wineryId", () => Int)
    wineryId: number
  ): Promise<ReservedSlotsResponse> {
    return await getReservedSlots(wineryId);
  }

  @Query(() => ReservedSlotsResponse)
  async experienceReservedSlots(
    @Arg("experienceId", () => Int)
    experienceId: number
  ): Promise<ReservedSlotsResponse> {
    return await getExperienceReservedSlots(experienceId);
  }
}
