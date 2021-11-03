import { addMinutes } from "date-fns";
import serviceReservationDataServices from "../../dataServices/serviceReservation";
import serviceDataServices from "../../dataServices/service";
import userServices from "../../dataServices/user";
import wineryServices from "../../dataServices/winery";
import { Service } from "../../entities/Service";
import { ReserveServiceInputs } from "../../resolvers/Service/serviceResolversInputs";
import sendEmail from "../../utils/sendEmail";
import bookedService, {
  BookedServiceData,
} from "../../utils/emailsTemplates/emailConfirmationRegistration/bookedService";

interface ReservationInputs extends ReserveServiceInputs {
  userId: number;
}

const makeReservation = async (
  inputs: ReservationInputs,
  serviceToBook: Service,
  parentService: Service
) => {
  const attendeesAfterBooking =
    serviceToBook.noOfAttendees + inputs.noOfAttendees;
  const tooManyPeople = attendeesAfterBooking > serviceToBook.limitOfAttendees;

  if (tooManyPeople)
    return {
      errors: [
        {
          field: "updateServiceFull",
          message: `Cant book because there are only ${
            serviceToBook.limitOfAttendees - serviceToBook.noOfAttendees
          } places left`,
        },
      ],
    };

  try {
    await serviceReservationDataServices.insertOrUpdateReservation(
      serviceToBook.id,
      inputs.userId,
      inputs.noOfAttendees,
      inputs.paypalOrderId,
      inputs.pricePerPersonInDollars,
      inputs.paymentCreationDateTime,
      inputs.status,
      parentService.creatorId,
      parentService.id
    );
  } catch (e) {
    console.log("Error updating service", e);
    return {
      errors: [{ field: "makeReservation", message: "Error updating service" }],
    };
  }

  const updatedService = await serviceDataServices.findServiceById(
    serviceToBook.id
  );

  if (updatedService === undefined) {
    return {
      errors: [
        {
          field: "makeReservation",
          message: "Error retrieving updated service",
        },
      ],
    };
  }

  const user = await userServices.findUserById(inputs.userId);
  const winery = await wineryServices.findWineryById(serviceToBook.wineryId);

  if (winery === undefined)
    return {
      errors: [
        { field: "makeReservation", message: "User didnt create a winery" },
      ],
    };

  // TODO: esperar definicion de funcionalidad
  // const allServices = await serviceDataServices.getAllService();
  // let randomService = undefined;
  // if (allServices.length > 0) {
  //     randomService = allServices[Math.floor(Math.random() * allServices.length)]
  // }
  // const randomWinery = await wineryServices.findWineryById(randomService?.wineryId || 0)
  // const randomWineryImage = await wineryImagesServices.getCoverImageGallery(randomService?.wineryId || 0);

  const registerData: BookedServiceData = {
    cost: inputs.noOfAttendees * inputs.pricePerPersonInDollars,
    eventType: serviceToBook.eventType,
    startDateTime: serviceToBook.startDateTime,
    wineryName: winery.name,
    // recommendedEventType: randomService?.eventType,
    // recommendedWineryName: randomWinery?.name,
    // recommendedWineryId: randomWinery?.id,
    // recommendedWineryImage: randomWineryImage?.imageUrl,
  };

  const emailData = {
    sender: '"Vin plan" <no-reply@vinplan>',
    email: user?.email,
    subject: "Registration Confirmation",
    html: bookedService(registerData),
    attachments: [
      {
        filename: "brand.png",
        path: "src/utils/emailsTemplates/emailConfirmationRegistration/brand.png",
        cid: "uniq-brand.png",
      },
      {
        filename: "checkllu.png",
        path: "src/utils/emailsTemplates/emailConfirmationRegistration/checkllu.png",
        cid: "uniq-checkllu.png",
      },
    ],
  };
  await sendEmail(emailData);
  return { service: updatedService };
};

const createRecurrentInstance = async (
  inputs: ReservationInputs,
  parentService: Service
) => {
  // Create the instance and book it
  let newDateWithOffset = new Date(inputs.startDateTime);
  newDateWithOffset.setMinutes(
    newDateWithOffset.getMinutes() + inputs.getTimezoneOffset
  );

  const calculateEndTime = addMinutes(
    newDateWithOffset,
    parentService.duration
  );
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
    startDateTime: newDateWithOffset,
    endDateTime: calculateEndTime,
    noOfAttendees: inputs.noOfAttendees,
  });
  try {
    await newRecurrentInstanceFromService.save();
  } catch (e) {
    console.log(e);
  }
  return newRecurrentInstanceFromService;
};

const reserve = async (inputs: ReservationInputs) => {
  const reservation =
    await serviceReservationDataServices.findUserReservationByIdAndUserId(
      inputs.serviceId,
      inputs.userId
    );

  if (reservation)
    return {
      errors: [
        {
          field: "updateService",
          message: "the user has reserved the service already.",
        },
      ],
    };

  const parentService =
    await serviceDataServices.findServiceNotMadeByCreatorByServiceAndCreatorId(
      inputs.serviceId,
      inputs.userId
    );

  if (parentService === undefined) {
    return {
      errors: [
        {
          field: "yourOwnService",
          message: "youre trying to book a service you created",
        },
      ],
    };
  }

  const recurrentInstance =
    await serviceDataServices.findServiceByParentIdAndStartDateTime(
      inputs.serviceId,
      inputs.startDateTime
    );

  return makeReservation(
    inputs,
    recurrentInstance
      ? recurrentInstance
      : await createRecurrentInstance(inputs, parentService),
    parentService
  );
};

export default reserve;
