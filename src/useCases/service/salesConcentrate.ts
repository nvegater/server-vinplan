import experiencesDataServices from "../../dataServices/serviceReservation"
import {ServiceReservation} from "../../entities/ServiceReservation"

export interface salesConcentrateModel extends ServiceReservation {


}

const salesConcentrate = async (paypalTransaccionId : string) => {
    const data = await experiencesDataServices.payPalReports(paypalTransaccionId);
    console.log(buildExcelData(data));
    return paypalTransaccionId+"";
}


const buildExcelData = (experienceInfo: salesConcentrateModel[]) => {
    return experienceInfo.map((experience) => {
        return {
            'Fecha de transaction': experience.paymentCreationDateTime,
            'Folio de transaccion': experience.paypalOrderId,
            'Nombre del usuario': experience.user.username,
            'Correo electrónico': experience.user.email,
            'Experiencia reservada': experience.service.title,
            'Vinicola': experience.service.winery.name,
            'Numero de personas' : experience.noOfAttendees,
            'Monto' : experience.noOfAttendees * experience.pricePerPersonInDollars + " dolares"
        }
    });
}

export default salesConcentrate;