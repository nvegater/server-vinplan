import {
  getImagesNumberGallery,
  insertImageInExperienceGallery,
} from "../../dataServices/pictures";
import { FieldError } from "../../resolvers/Outputs/ErrorOutputs";

const tooManyImagesError = [
  {
    field: "images",
    message: "only 10 images allowed you cant upload any image anymore",
  },
];

const couldntUploadImages = [
  {
    field: "images",
    message: "There was an error saving your images",
  },
];
const nImagesTooMuch = (noOfImages: number): FieldError[] => {
  return [
    {
      field: "images",
      message: `only 10 images allowed, you can still upload ${noOfImages.toString()}`,
    },
  ];
};
const ALLOWED_IMAGES = 10;

export const saveExperienceImageReferences = async (
  experienceId: number,
  urlImages: string[]
) => {
  const imagesCount = await getImagesNumberGallery(experienceId);
  if (imagesCount >= ALLOWED_IMAGES) {
    const errors = tooManyImagesError;
    console.log(errors);
    return { errors };
  }

  const potentialNoOfImagesAfterUpload = urlImages.length + imagesCount;

  if (potentialNoOfImagesAfterUpload > ALLOWED_IMAGES) {
    const possibleImagesToUpload = ALLOWED_IMAGES - imagesCount;
    const errors = nImagesTooMuch(possibleImagesToUpload);
    console.log(errors);
    return { errors };
  }

  const uploadedImages = await Promise.all(
    urlImages.map(async (urlImage, index) => {
      // if there are no images make the first image the cover
      const makeCoverPage = index === 0 && imagesCount === 0;

      const experienceImage = await insertImageInExperienceGallery(
        experienceId,
        urlImage,
        makeCoverPage
      );

      return {
        imageUrl: experienceImage.imageUrl,
        coverPage: experienceImage.coverPage,
      };
    })
  );

  if (uploadedImages.length === 0) {
    return { errors: couldntUploadImages };
  }

  return { experienceImages: uploadedImages };
};
