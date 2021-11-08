import { Picture } from "../entities/Picture";

export const insertExperienceImage = async (
  experienceId: number,
  urlImage: string,
  coverPage: boolean
) => {
  const serviceImage = Picture.create({
    experienceId: experienceId,
    imageUrl: urlImage,
    coverPage: coverPage,
  });
  return await serviceImage.save();
};

export const findImageById = async (imageId: number) => {
  return await Picture.findOne(imageId);
};

export const deleteImageById = async (imageId: number) => {
  return await Picture.delete(imageId);
};

export const getServiceGalleryById = async (experienceId: number) => {
  return Picture.find({
    where: { experienceId },
  });
};

export const getImagesNumberGallery = async (experienceId: number) => {
  return await Picture.count({ experienceId });
};

export const deleteDefaultPicture = async (experienceId: number) => {
  const defaultPicture = await Picture.findOne({
    where: { experienceId, coverPage: true },
  });
  if (defaultPicture) {
    await Picture.delete(defaultPicture.id);
  }
};

export const updateDefaultPictureToEvent = async (
  experienceId: number,
  urlImage: string
) => {
  return await Picture.update(
    { experienceId, coverPage: true },
    { imageUrl: urlImage }
  );
};

export const selectCoverPageImage = async (experienceId: number) => {
  return await Picture.update({ experienceId }, { coverPage: true });
};

export const unSelectCoverPageImage = async (experienceId: number) => {
  return await Picture.update(
    { experienceId, coverPage: false },
    { coverPage: true }
  );
};

// TODO review all of this functionality
export const getCoverImageGallery = async (serviceId: number) => {
  return Picture.findOne({
    where: { serviceId: serviceId, coverPage: true },
  });
};
