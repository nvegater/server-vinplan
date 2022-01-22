import {
  countWineryImages,
  insertWineryImage,
  retrieveImagesWinery,
} from "../../dataServices/pictures";
import {
  GetImage,
  ImageGalleryResponse,
  InsertImageResponse,
} from "../../resolvers/Outputs/presignedOutputs";
import { getImageUrl } from "../../dataServices/s3Utilities";
import { customError } from "../../resolvers/Outputs/ErrorOutputs";

const couldntUploadImages = [
  {
    field: "images",
    message: "There was an error saving your images",
  },
];

export const saveWineryImage = async (
  wineryId: number,
  wineryAlias: string,
  imageNames: string[]
): Promise<InsertImageResponse> => {
  const imagesCount = await countWineryImages(wineryId);

  const uploadedImageNames = await Promise.all(
    imageNames.map(async (imageName, index) => {
      // if there are no images make the first image the cover
      const makeCoverPage = index === 0 && imagesCount === 0;

      const wineryImage = await insertWineryImage(
        wineryId,
        wineryAlias,
        imageName,
        makeCoverPage
      );

      return wineryImage.imageName;
    })
  );

  if (uploadedImageNames.length === 0) {
    return { errors: couldntUploadImages };
  }

  return { imageNames: uploadedImageNames };
};

export const getWineryImages = async (
  wineryId: number,
  wineryAlias: string
): Promise<ImageGalleryResponse> => {
  const allImages = await retrieveImagesWinery(wineryId);

  if (allImages.length === 0) {
    return { gallery: [] };
  }

  const imagesGetUrls: GetImage[] = await Promise.all(
    allImages.map(async (image) => {
      const imageGetUrl = await getImageUrl(image.imageName, wineryAlias);
      return {
        id: image.id,
        imageName: image.imageName,
        getUrl: imageGetUrl,
      };
    })
  );

  if (imagesGetUrls.length === 0) {
    return customError("images", "couldnt generate get Urls for the winery");
  }

  return { gallery: imagesGetUrls };
};
