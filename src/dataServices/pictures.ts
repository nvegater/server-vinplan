import { ExperienceImage, WineryImage } from "../entities/Images";
export const insertExperienceImage = async (
  experienceId: number,
  imageName: string,
  coverPage: boolean
) => {
  const serviceImage = ExperienceImage.create({
    experienceId: experienceId,
    imageName: imageName,
    coverPage: coverPage,
  });
  return await serviceImage.save();
};

export const insertImageInExperienceGallery = async (
  experienceId: number,
  imageName: string,
  coverPage: boolean
) => {
  const experienceImage = ExperienceImage.create({
    experienceId: experienceId,
    imageName: imageName,
    coverPage: coverPage,
  });
  return await experienceImage.save();
};

export const insertWineryImage = async (
  wineryId: number,
  wineryAlias: string,
  imageName: string,
  coverPage: boolean
) => {
  const wineryImage = WineryImage.create({
    wineryId: wineryId,
    wineryAlias: wineryAlias,
    imageName: imageName,
    coverPage: coverPage,
  });
  return await wineryImage.save();
};

export const findImageById = async (imageId: number) => {
  return await ExperienceImage.findOne(imageId);
};

export const deleteImageById = async (imageId: number) => {
  return await ExperienceImage.delete(imageId);
};

export const getServiceGalleryById = async (experienceId: number) => {
  return ExperienceImage.find({
    where: { experienceId },
  });
};

export const getImagesNumberGallery = async (experienceId: number) => {
  return await ExperienceImage.count({ experienceId });
};

export const countWineryImages = async (wineryId: number) => {
  return await WineryImage.count({ where: { wineryId: wineryId } });
};

export const retrieveImagesWinery = async (wineryId: number) => {
  return await WineryImage.find({ where: { wineryId } });
};

export const deleteDefaultPicture = async (experienceId: number) => {
  const defaultPicture = await ExperienceImage.findOne({
    where: { experienceId, coverPage: true }, // TODO: double check with: https://github.com/typeorm/typeorm/issues/2929
  });
  if (defaultPicture) {
    await ExperienceImage.delete(defaultPicture.id);
  }
};

export const updateDefaultPictureToEvent = async (
  experienceId: number,
  urlImage: string
) => {
  return await ExperienceImage.update(
    { experienceId, coverPage: true },
    { imageName: urlImage }
  );
};

export const selectCoverPageImage = async (experienceId: number) => {
  return await ExperienceImage.update({ experienceId }, { coverPage: true });
};

export const unSelectCoverPageImage = async (experienceId: number) => {
  return await ExperienceImage.update(
    { experienceId, coverPage: false },
    { coverPage: true }
  );
};

// TODO review all of this functionality
export const getCoverImageGallery = async (serviceId: number) => {
  return ExperienceImage.findOne({
    where: { serviceId: serviceId, coverPage: true },
  });
};
