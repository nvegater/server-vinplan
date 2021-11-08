import { getImagesNumberGallery } from "../../dataServices/pictures";

const getImagesNumberInGallery = async (
  idExperience: number
): Promise<number> => {
  try {
    return await getImagesNumberGallery(idExperience);
  } catch (error) {
    throw new Error(error);
  }
};

export default getImagesNumberInGallery;
