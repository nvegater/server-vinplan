import { getImagesNumberGallery } from "../../dataServices/pictures";

const getImagesNumberInGallery = async (idGallery: number): Promise<number> => {
  try {
    return await getImagesNumberGallery(idGallery);
  } catch (error) {
    throw new Error(error);
  }
};

export default getImagesNumberInGallery;
