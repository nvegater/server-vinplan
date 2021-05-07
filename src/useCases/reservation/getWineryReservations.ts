import serviceReservationDataServices from "../../dataServices/serviceReservation"


const getWineryReservations = async (wineryId:number) => {
    return await serviceReservationDataServices.findWineryReservations(wineryId)
}

export default getWineryReservations;