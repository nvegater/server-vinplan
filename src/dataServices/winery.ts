import {Winery} from "../entities/Winery";


const findWineryByCreator = async (userId: number) => {
    return await Winery.findOne({where: {creatorId: userId}})
}

export default {
    findWineryByCreator
}