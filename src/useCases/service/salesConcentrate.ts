import experiencesDataServices from "../../dataServices/serviceReservation";
import {ServiceReservation} from "../../entities/ServiceReservation";
import {SalesConcentrate} from "../../resolvers/Service/serviceResolversOutputs";
import {s3UploadFile} from "../../utils/s3Utilities";
const Excel = require('exceljs');

const getColumns = (obj: any) => Object.keys(obj).map((key) => ({header: key, key}));

const salesConcentrate = async (paypalTransaccionId : string) : Promise<SalesConcentrate> => {
    try {
        const data = await experiencesDataServices.payPalReports(paypalTransaccionId);

        const workbook = new Excel.Workbook();
        workbook.creator = 'Vin Plan - salesConcentrate';

        const reportSheet = workbook.addWorksheet('report');

        const responseObject = buildExcelData(data);

        reportSheet.columns = getColumns(responseObject[0]);
        reportSheet.addRows(responseObject);

        const date = new Date();
        const filename = `reports/experiences/sales-concentrate/report_${date.getDay()}_${date.getMonth()}_${date.getFullYear()}.xlsx`;
        const xlsxBuffer = await workbook.xlsx.writeBuffer();

        const signedUrl = await s3UploadFile(xlsxBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return {url : signedUrl};
    } catch (error) {
        throw new Error(error)
    }
    
}


const buildExcelData = (experienceInfo: ServiceReservation[]) => {
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