import serviceReservationDataServices from "../../dataServices/serviceReservation";

const getUserReservations = async (userId: number) => {
  return await serviceReservationDataServices.findUserReservations(userId);
};

export default getUserReservations;
