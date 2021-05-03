import {addMinutes} from "date-fns";
import serviceReservationDataServices from "../../dataServices/serviceReservation"
import serviceDataServices from "../../dataServices/service";
import {Service} from "../../entities/Service";
import {ReserveServiceInputs} from "../../resolvers/Service/serviceResolversInputs";

interface ReservationInputs extends ReserveServiceInputs {
    userId: number,
}

const makeReservation = async (inputs: ReservationInputs, serviceToBook: Service, parentService?: Service) => {

    if ((serviceToBook.noOfAttendees + inputs.noOfAttendees) > serviceToBook.limitOfAttendees)
        return {
            errors: [{
                field: "updateServiceFull",
                message: `Cant book because there are only ${serviceToBook.limitOfAttendees - serviceToBook.noOfAttendees} places left`
            }]
        }

    try {
        await serviceReservationDataServices
            .insertOrUpdateReservation(
                serviceToBook.id,
                inputs.userId,
                inputs.noOfAttendees,
                inputs.paypalOrderId,
                inputs.pricePerPersonInDollars,
                inputs.paymentCreationDateTime,
                inputs.status,
                serviceToBook.creatorId,
                !!parentService ? parentService.id : serviceToBook.id
            )
    } catch (e) {
        console.log(e)
    }

    const updatedService = await serviceDataServices.findServiceById(serviceToBook.id)

    if (updatedService === undefined)
        return {errors: [{field: "makeReservation", message: "Error retrieving updated service"}]};

    return {service: updatedService};

}


const createRecurrentInstanceAndReserve = async (inputs: ReservationInputs, parentService: Service) => {
    // Create the instance and book it
    const calculateEndTime = addMinutes(inputs.startDateTime, parentService.duration)
    const newRecurrentInstanceFromService = await Service.create({
        // Copy props from parent event
        wineryId: parentService.wineryId,
        limitOfAttendees: parentService.limitOfAttendees,
        pricePerPersonInDollars: parentService.pricePerPersonInDollars,
        title: parentService.title,
        description: parentService.description,
        eventType: parentService.eventType,
        duration: parentService.duration,
        creatorId: parentService.creatorId,
        // new props
        parentServiceId: parentService.id,
        startDateTime: inputs.startDateTime,
        endDateTime: calculateEndTime,
        noOfAttendees: inputs.noOfAttendees
    })
    try {
        await newRecurrentInstanceFromService.save();
    } catch (e) {
        console.log(e)
    }
    try {
        await serviceReservationDataServices
            .insertOrUpdateReservation(
                newRecurrentInstanceFromService.id,
                inputs.userId,
                inputs.noOfAttendees,
                inputs.paypalOrderId,
                inputs.pricePerPersonInDollars,
                inputs.paymentCreationDateTime,
                inputs.status,
                parentService.creatorId,
                parentService.id
            )
    } catch (e) {
        console.log(e)
    }
    return {service: newRecurrentInstanceFromService};
}

const prepareRecurrentInstance = async (inputs: ReservationInputs, parentService: Service) => {
    const recurrentInstance = await serviceDataServices
        .findServiceByParentIdAndStartDateTime(inputs.serviceId, inputs.startDateTime);
    return recurrentInstance === undefined
        ? createRecurrentInstanceAndReserve(inputs, parentService)
        : makeReservation(inputs, recurrentInstance, parentService)

}


const reserve = async (inputs: ReservationInputs) => {

    const reservation = await serviceReservationDataServices
        .findUserReservationByIdAndUserId(inputs.serviceId, inputs.userId);

    if (reservation)
        return {errors: [{field: "updateService", message: "the user has reserved the service already."}]};

    const parentService = await serviceDataServices
        .findServiceNotMadeByCreatorByServiceAndCreatorId(inputs.serviceId, inputs.userId);

    if (parentService === undefined)
        return {errors: [{field: "yourOwnService", message: "youre trying to book a service you created"}]}

    const bookRecurrentInstance = inputs.startDateTime !== parentService.startDateTime;

    return bookRecurrentInstance
        ? prepareRecurrentInstance(inputs, parentService)
        : makeReservation(inputs, parentService)

}

export default reserve;