import {WineryLanguage} from "../entities/WineryLanguage"

const getWineryLanguageByWineryId = async (wineryId: number) => {
    return await WineryLanguage.find({
        where: {wineryId: wineryId}
    });
} 

export default {
    getWineryLanguageByWineryId,
}