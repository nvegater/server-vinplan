import {WineryAmenity} from "../entities/WineryAmenity"

const getWineryAmenityByWineryId = async (wineryId: number) => {
    return await WineryAmenity.find({
        where: {wineryId: wineryId}
    });
} 

export default {
    getWineryAmenityByWineryId,
}