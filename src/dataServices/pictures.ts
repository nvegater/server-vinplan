import { ExperienceImage, WineryImage } from "../entities/Images";

export const getWineryImageById = (id: number) => {
  return WineryImage.findOne(id);
};
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

export const countExperienceImagesByExperienceId = async (
  experienceId: number
) => {
  return await ExperienceImage.count({ where: { experienceId } });
};

export const countWineryImagesByWineryId = async (wineryId: number) => {
  return await WineryImage.count({ where: { wineryId } });
};

export const retrieveImagesWinery = async (wineryId: number) => {
  return await WineryImage.find({ where: { wineryId } });
};

export const selectCoverPageImage = async (experienceId: number) => {
  return await ExperienceImage.update({ experienceId }, { coverPage: true });
};

export const getImagesByExperienceId = async (experienceId: number) => {
  return await ExperienceImage.find({ where: { experienceId } });
};
