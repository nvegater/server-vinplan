import { WineryImageGallery } from "../entities/WineryImageGallery";
import { getConnection } from "typeorm";

const insertImageInWineryGallery = async (
  wineryId: number,
  urlImage: string,
  coverPage: boolean
) => {
  const wineryImage = WineryImageGallery.create({
    wineryId: wineryId,
    imageUrl: urlImage,
    coverPage: coverPage,
  });
  return await wineryImage.save();
};

const findImageById = async (imageId: number) => {
  return await WineryImageGallery.findOne(imageId);
};

const deleteImageById = async (imageId: number) => {
  return await WineryImageGallery.delete(imageId);
};

const getWineryGalleryById = async (wineryId: number) => {
  return WineryImageGallery.find({
    where: { wineryId: wineryId },
  });
};

const getImagesNumberGallery = async (wineryId: number) => {
  return await WineryImageGallery.count({ wineryId });
};

const selectCoverPageImage = async (wineryImageId: number) => {
  return await getConnection()
    .createQueryBuilder()
    .update(WineryImageGallery)
    .set({
      coverPage: true,
    })
    .where("id = :wineryImageId", { wineryImageId: wineryImageId })
    .returning("*")
    .execute();
};

const unSelectCoverPageImage = async (wineryId: number) => {
  return await getConnection()
    .createQueryBuilder()
    .update(WineryImageGallery)
    .set({
      coverPage: false,
    })
    .where("wineryId = :wineryId and coverPage = :coverPage", {
      wineryId: wineryId,
      coverPage: true,
    })
    .returning("*")
    .execute();
};

const getCoverImageGallery = async (wineryId: number) => {
  return WineryImageGallery.findOne({
    where: { wineryId: wineryId, coverPage: true },
  });
};

export default {
  insertImageInWineryGallery,
  getWineryGalleryById,
  getImagesNumberGallery,
  selectCoverPageImage,
  unSelectCoverPageImage,
  findImageById,
  deleteImageById,
  getCoverImageGallery,
};
