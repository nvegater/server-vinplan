import {Winery} from "../entities/Winery";

const findWineryByCreator = async (userId: number) => {
    return await Winery.findOne({where: {creatorId: userId}})
}

const findWineryById = async (wineryId : number) => {
    return await Winery.findOne(wineryId)
}

export default {
    findWineryByCreator,
    findWineryById,
}