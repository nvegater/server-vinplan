import { Winery, Valley } from "../entities/Winery";
import { getRepository } from "typeorm";

const findWineryByCreator = async (userId: number) => {
  return await Winery.findOne({ where: { creatorId: userId } });
};

const findWineryById = async (wineryId: number) => {
  return await Winery.findOne(wineryId);
};

const findWineryByValley = async (valley: Valley[]) => {
  return await getRepository(Winery)
    .createQueryBuilder("winery")
    .where('winery."valley" IN (:...valley)', { valley: valley })
    .getMany();
};

const updateWinery = async (winery: Winery) => {
  return await Winery.update(winery.id, winery);
};

export default {
  findWineryByCreator,
  findWineryById,
  findWineryByValley,
  updateWinery,
};
