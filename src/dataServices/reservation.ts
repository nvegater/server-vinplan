import { Reservation } from "../entities/Reservation";

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
}

export const createReservation = async (props: CreateReservationInputs) => {
  const reservation = Reservation.create(props);
  await reservation.save();
  return reservation;
};
