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
  imageKeys: string[]
): Promise<InsertImageResponse> => {
  const imagesCount = await countWineryImages(wineryId);

  const uploadedImageKeys = await Promise.all(
    imageKeys.map(async (imageKey, index) => {
      // if there are no images make the first image the cover
      const makeCoverPage = index === 0 && imagesCount === 0;

      const wineryImage = await insertWineryImage(
        wineryId,
        imageKey,
        makeCoverPage
      );

      return wineryImage.imageKey;
    })
  );

  if (uploadedImageKeys.length === 0) {
    return { errors: couldntUploadImages };
  }

  return { imageKeys: uploadedImageKeys };
};

export const getWineryImages = async (
  wineryId: number,
  wineryAlias: string
): Promise<ImageGalleryResponse> => {
  const allImages = await retrieveImagesWinery(wineryId);

  const imagesGetUrls: GetImage[] = await Promise.all(
    allImages.map(async (image) => {
      const imageKeyGetUrl = await getImageUrl(image.imageKey, wineryAlias);
      return {
        imageKey: image.imageKey,
        getUrl: imageKeyGetUrl,
      };
    })
  );

  if (imagesGetUrls.length > 0) {
    return customError("images", "couldnt generate get Urls for the winery");
  }

  return { gallery: imagesGetUrls };
};
