import { WineGrapesProduction, Grape } from "../entities/WineGrapesProduction";

const getWineGrapesById = async (wineryId: number) => {
  return await WineGrapesProduction.find({
    where: { wineryId: wineryId },
  });
};

const insertGrapesToWinery = async (wineryId: number, grape: Grape) => {
  return await WineGrapesProduction.create({
    wineryId: wineryId,
    wineGrapesProduction: grape,
  }).save();
};

const deleteGrapesToWinery = async (wineryId: number, grape: Grape) => {
  return await WineGrapesProduction.delete({
    wineryId: wineryId,
    wineGrapesProduction: grape,
  });
};

export default {
  getWineGrapesById,
  insertGrapesToWinery,
  deleteGrapesToWinery,
};
