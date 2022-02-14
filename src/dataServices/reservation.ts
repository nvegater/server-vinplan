import { Reservation } from "../entities/Reservation";
import { typeReturn } from "./utils";
import { getConnection } from "typeorm";

interface CreateReservationInputs {
  title: string;
  email: string;
  username: string | null;
  noOfAttendees: number;
  pricePerPersonInDollars: number;
  paymentStatus: "no_payment_required" | "paid" | "unpaid";
  slotId: number;
  startDateTime: Date;
  endDateTime: Date;
  wineryName: string;
  experienceId: number;
}

export const createReservation = async (props: CreateReservationInputs) => {
  const reservation = Reservation.create(props);
  await reservation.save();
  return reservation;
};

export const reservationsByEmail = async (
  email: string
): Promise<Reservation[]> => {
  return await Reservation.find({ where: { email } });
};

export const confirmReservationPayment = async (ids: number[]) => {
  return await Promise.all(
    ids.map(async (id) => {
      return await typeReturn<Reservation>(
        getConnection()
          .createQueryBuilder()
          .update(Reservation)
          .set({ paymentStatus: "paid" })
          .where("id = :id", { id })
          .returning("*")
          .execute()
      );
    })
  );
};

export const getReservationsFromExperienceIds = async (
  experienceIds: number[]
) => {
  return await getConnection()
    .createQueryBuilder(Reservation, "res")
    .leftJoinAndSelect("res.slot", "slot") // to load the relationships
    .where("res.experienceId IN (:...experienceIds)", {
      experienceIds: experienceIds,
    })
    .orderBy("res.startDateTime")
    .getMany();
};
