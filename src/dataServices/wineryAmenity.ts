import { WineryAmenity, Amenity } from "../entities/WineryAmenity";

const getWineryAmenityByWineryId = async (wineryId: number) => {
  return await WineryAmenity.find({
    where: { wineryId: wineryId },
  });
};

const insertAmenityToWinery = async (wineryId: number, amenity: Amenity) => {
  return await WineryAmenity.create({
    wineryId: wineryId,
    amenity: amenity,
  }).save();
};

const deleteAmenityToWinery = async (wineryId: number, amenity: Amenity) => {
  return await WineryAmenity.delete({
    wineryId: wineryId,
    amenity: amenity,
  });
};

export default {
  getWineryAmenityByWineryId,
  insertAmenityToWinery,
  deleteAmenityToWinery,
};
