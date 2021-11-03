import serviceReservationDataServices from "../../dataServices/serviceReservation";
// import {ReservationsWinery} from "../../resolvers/Reservations/reservationsOutputs"
import userServices from "../../dataServices/user";
import experiencesServices from "../../dataServices/service";
import { ServiceReservation } from "../../entities/ServiceReservation";

const getWineryReservations = async (
  wineryId: number
): Promise<ServiceReservation[]> => {
  const reservations =
    await serviceReservationDataServices.findWineryReservations(wineryId);
  const reservationsPromisesUsers = reservations.map((reservation) =>
    userServices.findUserById(reservation.userId)
  );
  const reservationsPromisesExperiences = reservations.map((reservation) =>
    experiencesServices.findServiceById(reservation.serviceId)
  );
  const reservationsUsers = await Promise.all(reservationsPromisesUsers);
  const reservationsExperiences = await Promise.all(
    reservationsPromisesExperiences
  );
  return reservations.map((reservation, i) => {
    let reservationToSave: any = reservation;
    if (reservationsUsers[i] != undefined) {
      reservationToSave.userInfo = reservationsUsers[i];
    }
    if (reservationsExperiences[i] != undefined) {
      reservationToSave.experienceInfo = reservationsExperiences[i];
    }
    return reservation;
  });
};

export default getWineryReservations;
