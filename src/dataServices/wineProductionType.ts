import {WineProductionType} from "../entities/WineProductionType"

const getProductionTypeByWineryId = async (wineryId: number) => {
    return WineProductionType.find({
        where: {wineryId: wineryId}
    });
} 

export default {
    getProductionTypeByWineryId,
}