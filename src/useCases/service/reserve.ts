import {addMinutes} from "date-fns";
import serviceReservationDataServices from "../../dataServices/serviceReservation"
import serviceDataServices from "../../dataServices/service";
import {Service} from "../../entities/Service";
import {ReserveServiceInputs} from "../../resolvers/Service/serviceResolversInputs";

interface ReservationInputs extends ReserveServiceInputs {
    userId: number,
}

const makeReservation = async (inputs: ReservationInputs, service: Service) => {

    if ((service.noOfAttendees + inputs.noOfAttendees) > service.limitOfAttendees)
        return {
            errors: [{
                field: "updateServiceFull",
                message: `Cant book because there are only ${service.limitOfAttendees - service.noOfAttendees} places left`
            }]
        }

    const updateAttendes = await serviceDataServices
        .updateAttendeesByIdAndCreator(service.id, service.creatorId, inputs.noOfAttendees, service.noOfAttendees);

    if (updateAttendes.affected === 0)
        return {errors: [{field: "updateService", message: "no change was made"}]}

    try {
        await serviceReservationDataServices
            .insertOrUpdateReservation(service.id, inputs.userId, inputs.noOfAttendees)
    } catch (e) {
        console.log(e)
    }

    return {service: updateAttendes.raw[0] as Service};

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
            .insertReservation(
                newRecurrentInstanceFromService.id,
                inputs.userId,
                inputs.noOfAttendees,
                inputs.paypalOrderId,
                inputs.pricePerPersonInDollars,
                inputs.paymentCreationDateTime,
                inputs.status,
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
        : makeReservation(inputs, recurrentInstance)

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