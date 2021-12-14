import {
  ExperienceImageResponse,
  ExperienceImageUpload,
} from "../../resolvers/PreSignedUrl/presigned";
import {
  getImagesNumberGallery,
  insertImageInExperienceGallery,
} from "../../dataServices/pictures";
export const insertImages = async (
  experienceId: number,
  urlImages: string[]
): Promise<ExperienceImageResponse> => {
  const imagesCount = await getImagesNumberGallery(experienceId);
  const tooManyImagesError = [{ field: "picture", message: "too many images" }];
  if (imagesCount >= 9) {
    return { errors: tooManyImagesError };
  }

  const uploadedImages: ExperienceImageUpload[] = await Promise.all(
    urlImages.map(async (urlImage, index) => {
      const potentiallyNewImageCount = imagesCount + index;
      if (potentiallyNewImageCount > 9) {
        // TODO return error
      }
      const makeCoverPage = potentiallyNewImageCount === 0;

      const images = await insertImageInExperienceGallery(
        experienceId,
        urlImage,
        makeCoverPage
      );

      return {
        imageUrl: images.imageUrl,
        coverPage: images.coverPage,
      };
    })
  );

  if (uploadedImages.length === 0) {
    return { errors: tooManyImagesError };
  }

  return { errors: tooManyImagesError }; // TODO change
};
