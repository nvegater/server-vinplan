import {WineType} from "../entities/WineType"

const getWineTypeByWineryId = async (wineryId: number) => {
    return await WineType.find({
        where: {wineryId: wineryId}
    });
} 

export default {
    getWineTypeByWineryId,
}