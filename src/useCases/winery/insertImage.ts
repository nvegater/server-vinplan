import { WineryImageGallery } from "../../entities/WineryImageGallery";
import wineryResolverErrors from "../../resolvers/Winery/wineryResolversErrors";
import { WineryImageGalleryResponse } from "../../resolvers/Winery/wineryResolversOutputs";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";

const insertImage = async (
  wineryId: number,
  urlImages: string[]
): Promise<WineryImageGalleryResponse> => {
  try {
    let imagesCount = await WineryImageGalleryServices.getImagesNumberGallery(
      wineryId
    );
    let currentNumberOfImages = 0;
    for (let i = 0; i < urlImages.length; i++) {
      currentNumberOfImages = i + imagesCount;
      if (currentNumberOfImages > 9) {
        break;
      }
      await WineryImageGalleryServices.insertImageInWineryGallery(
        wineryId,
        urlImages[i],
        currentNumberOfImages == 0
      );
    }

    const wineryImages: WineryImageGallery[] | undefined =
      await WineryImageGalleryServices.getWineryGalleryById(wineryId);
    const response: WineryImageGalleryResponse = {
      images: wineryImages,
    };

    if (currentNumberOfImages > 9) {
      response.errors = [wineryResolverErrors.maxElements];
    }

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export default insertImage;
