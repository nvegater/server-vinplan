import ServiceImageGalleryServices from "../dataServices/serviceImageGallery";
import { Service } from "../entities/Service";

const winery = () => {};

const experience = async (experienceFound: Service) => {
  const imageSelected =
    (await ServiceImageGalleryServices.getCoverImageGallery(
      experienceFound?.id
    )) || undefined;
  if (imageSelected) {
    return imageSelected.imageUrl;
  } else {
    const defaultData =
      await ServiceImageGalleryServices.findDefaultImageByEventType(
        experienceFound?.eventType
      );
    return defaultData?.defaultImageUrl;
  }
};

export default {
  winery,
  experience,
};
