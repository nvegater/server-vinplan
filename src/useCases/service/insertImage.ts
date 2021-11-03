import { ServiceImageResponse } from "../../resolvers/Service/serviceResolversOutputs";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery";
import wineryResolverErrors from "../../resolvers/Winery/wineryResolversErrors";

const insertImage = async (
  serviceId: number,
  urlImages: string[]
): Promise<ServiceImageResponse> => {
  try {
    let imagesCount = await ServiceImageGalleryServices.getImagesNumberGallery(
      serviceId
    );
    let currentNumberOfImages = 0;
    for (let i = 0; i < urlImages.length; i++) {
      currentNumberOfImages = i + imagesCount;
      if (currentNumberOfImages > 9) {
        break;
      }
      await ServiceImageGalleryServices.insertImageInServiceGallery(
        serviceId,
        urlImages[i],
        currentNumberOfImages == 0
      );
    }
    const response: ServiceImageResponse = {
      success: true,
    };

    if (currentNumberOfImages > 9) {
      response.success = false;
      response.errors = [wineryResolverErrors.maxElements];
    }

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export default insertImage;
