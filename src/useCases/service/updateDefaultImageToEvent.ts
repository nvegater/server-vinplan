import { ServiceImageResponse } from "../../resolvers/Service/serviceResolversOutputs";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery";
import { EventType } from "../../entities/Service";

const updateDefaultImageToEvent = async (
  eventType: EventType,
  urlImage: string
): Promise<ServiceImageResponse> => {
  try {
    const serviceInserted =
      await ServiceImageGalleryServices.updateDefaultPictureToEvent(
        eventType,
        urlImage
      );

    if (serviceInserted === undefined) {
      return {
        errors: [
          {
            field: "imageId",
            message: "La imagen no se puede actualizar",
          },
        ],
        success: false,
      };
    } else {
      return { success: true };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default updateDefaultImageToEvent;
