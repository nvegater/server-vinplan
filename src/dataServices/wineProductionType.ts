import {
  WineProductionType,
  ProductionType,
} from "../entities/WineProductionType";

const getProductionTypeByWineryId = async (wineryId: number) => {
  return WineProductionType.find({
    where: { wineryId: wineryId },
  });
};

const insertProductionTypeToWinery = async (
  wineryId: number,
  productionType: ProductionType
) => {
  return await WineProductionType.create({
    wineryId: wineryId,
    productionType: productionType,
  }).save();
};

const deleteProductionTypeToWinery = async (
  wineryId: number,
  productionType: ProductionType
) => {
  return await WineProductionType.delete({
    wineryId: wineryId,
    productionType: productionType,
  });
};

export default {
  getProductionTypeByWineryId,
  insertProductionTypeToWinery,
  deleteProductionTypeToWinery,
};
