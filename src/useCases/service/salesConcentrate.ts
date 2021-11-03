import experiencesDataServices from "../../dataServices/serviceReservation";
import { ServiceReservation } from "../../entities/ServiceReservation";
import { SalesConcentrate } from "../../resolvers/Service/serviceResolversOutputs";
import { s3UploadFile } from "../../utils/s3Utilities";
import { buildExcelAsBuffer } from "../../utils/excelUtilities";
import { format } from "date-fns";

const salesConcentrate = async (
  paypalTransaccionId: string | null
): Promise<SalesConcentrate> => {
  try {
    const data = await experiencesDataServices.payPalReports(
      paypalTransaccionId
    );
    const excelInfo = {
      creator: "Vin Plan",
      report: "report",
      data: buildExcelData(data),
    };
    const date = new Date();
    const filename = `reports/experiences/sales-concentrate/report_${date.getDate()}_${
      date.getMonth() + 1
    }_${date.getFullYear()}.xlsx`;
    const signedUrl = await s3UploadFile(
      await buildExcelAsBuffer(excelInfo),
      filename,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return { url: signedUrl };
  } catch (error) {
    throw new Error(error);
  }
};

const buildExcelData = (experienceInfo: ServiceReservation[]) => {
  return experienceInfo.map((experience) => {
    return {
      "Fecha de transaction": format(
        new Date(experience.paymentCreationDateTime),
        "dd MMMM uuuu"
      ),
      "Folio de transaccion": experience.paypalOrderId,
      "Nombre del usuario": experience.user.username,
      "Correo electrónico": experience.user.email,
      "Experiencia reservada": experience.service.title,
      Vinicola: experience.service.winery.name,
      "Numero de personas": experience.noOfAttendees,
      Monto:
        experience.noOfAttendees * experience.pricePerPersonInDollars +
        " dolares",
    };
  });
};

export default salesConcentrate;
