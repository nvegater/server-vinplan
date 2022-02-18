import { getUpcomingWineryExperiences } from "../dataServices/experience";
import { customError } from "../resolvers/Outputs/ErrorOutputs";
import {
  ReservationDts,
  ReservedSlotsResponse,
  SlotReservations,
} from "../resolvers/ReservationResolvers";
import { getReservationsFromExperienceIds } from "../dataServices/reservation";
import { Reservation } from "../entities/Reservation";

export async function getReservedSlots(
  wineryId: number
): Promise<ReservedSlotsResponse> {
  const experiences = await getUpcomingWineryExperiences(wineryId);

  const reservations = await getReservationsFromExperienceIds(
    experiences.map((e) => e.id)
  );

  if (reservations.length === 0) {
    return customError("reservations", "No reservations found");
  }

  return { slotReservations: groupReservationsBySlot(reservations) };
}

export async function getExperienceReservedSlots(
  experienceId: number
): Promise<ReservedSlotsResponse> {
  const reservations = await getReservationsFromExperienceIds([experienceId]);

  if (reservations.length === 0) {
    return customError("reservations", "No reservations found");
  }

  return { slotReservations: groupReservationsBySlot(reservations) };
}

export function getUniqueListTyped<T>(array: Array<T>, key: string) {
  // @ts-ignore
  return [...new Map(array.map((item: T) => [item[key], item])).values()];
}

const groupReservationsBySlot = (
  reservations: Reservation[]
): SlotReservations[] => {
  const slots = reservations.map((r) => r.slot);
  const uniqueSlots = getUniqueListTyped(slots, "id");
  return uniqueSlots.map((slot) => {
    const resFromSlots = reservations.filter((r) => r.slotId === slot.id);

    const resToDts: ReservationDts[] = resFromSlots.map((r) => ({ ...r }));

    return {
      slot: slot,
      reservations: resToDts,
    };
  });
};
