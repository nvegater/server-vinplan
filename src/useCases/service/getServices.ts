import { Service } from "src/entities/Service";
import serviceDataServices from "../../dataServices/service"
import {convertDateToUTC} from "../../utils/dateUtils";

const getServices = async (serviceIds: number[]) => {
    try {
        const paginatedServicesDB = await serviceDataServices.findServicesByIds(serviceIds);

        if (paginatedServicesDB.length === 0)
            return {errors: [{field: "paginatedServicesDB", message: "Cant find services by Ids"}], moreServicesAvailable: false}

        // correct dates to UTC
        const servicesWithUTCDates:Service[] = paginatedServicesDB.map((ser)=>{
            ser.startDateTime = convertDateToUTC(ser.startDateTime);
            ser.endDateTime = convertDateToUTC(ser.endDateTime);
            return ser
        })
        return {
            paginatedServices: servicesWithUTCDates,
            moreServicesAvailable: false // DB has more posts than requested
        };
    } catch (error) {
        throw new Error(error)
    }
}

export default getServices;