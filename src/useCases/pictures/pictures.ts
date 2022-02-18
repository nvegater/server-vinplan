import {
  countExperienceImagesByExperienceId,
  countWineryImagesByWineryId,
  getWineryImageById,
  insertImageInExperienceGallery,
  insertWineryImage,
  retrieveImagesWinery,
} from "../../dataServices/pictures";
import {
  GetImage,
  ImageGalleryResponse,
  InsertImageResponse,
} from "../../resolvers/Outputs/presignedOutputs";
import { getWineryImageGetURL } from "../../dataServices/s3Utilities";
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
  const imagesCount = await countWineryImagesByWineryId(wineryId);

  const uploadedImageNames: GetImage[] = await Promise.all(
    imageNames.map(async (imageName, index) => {
      // if there are no images make the first image the cover
      const makeCoverPage = index === 0 && imagesCount === 0;

      const wineryImage = await insertWineryImage(
        wineryId,
        wineryAlias,
        imageName,
        makeCoverPage
      );

      const imageGetUrl = getWineryImageGetURL(
        wineryImage.imageName,
        wineryAlias
      );

      return {
        id: wineryImage.id,
        imageName: wineryImage.imageName,
        getUrl: imageGetUrl,
      };
    })
  );

  if (uploadedImageNames.length === 0) {
    return { errors: couldntUploadImages };
  }

  return { images: uploadedImageNames };
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
      const imageGetUrl = getWineryImageGetURL(image.imageName, wineryAlias);
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

export const addWineryImageToExperience = async (
  imageId: number,
  experienceId: number
): Promise<InsertImageResponse> => {
  const imagesCount = await countExperienceImagesByExperienceId(experienceId);

  if (imagesCount > 5) {
    return customError(
      "experienceImages",
      "This experience already has 5 images"
    );
  }

  const image = await getWineryImageById(imageId);

  if (image == null) {
    return customError("image", "That image is not in our database");
  }

  const insertedImage = await insertImageInExperienceGallery(
    experienceId,
    image.imageName,
    imagesCount === 0
  );

  return {
    images: [
      { id: insertedImage.id, imageName: insertedImage.imageName, getUrl: "" },
    ],
  };
};
