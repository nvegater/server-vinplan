import serviceReservationDataServices from "../../dataServices/serviceReservation"
import {ReservationsWinery} from "../../resolvers/Reservations/reservationsOutputs"
import userServices from "../../dataServices/user"
import experiencesServices from "../../dataServices/service"

const getWineryReservations = async (wineryId:number) : Promise<ReservationsWinery[]> => {
    const reservations = await serviceReservationDataServices.findWineryReservations(wineryId)
    const reservationsPromisesUsers = reservations.map(reservation => userServices.findUserById(reservation.userId));
    const reservationsPromisesExperiences = reservations.map(reservation => experiencesServices.findServiceById(reservation.serviceId));
    const reservationsUsers = await Promise.all(reservationsPromisesUsers);
    const reservationsExperiences = await Promise.all(reservationsPromisesExperiences);
    const reservationToSend : ReservationsWinery[] = reservations.map((reservation, i) => {
        let reservationToSave : ReservationsWinery = reservation;
        if (reservationsUsers[i] != undefined) {
            reservationToSave.user_info = reservationsUsers[i]
        }
        if (reservationsExperiences[i] != undefined) {
            reservationToSave.experience_info = reservationsExperiences[i]
        }
        return reservation
    });
    return reservationToSend;
}

export default getWineryReservations;