import {WineryLanguage, SupportedLanguage} from "../entities/WineryLanguage"

const getWineryLanguageByWineryId = async (wineryId: number) => {
    return await WineryLanguage.find({
        where: {wineryId: wineryId}
    });
} 

const insertSupportedLanguajeToWinery = async (wineryId : number, supportedLanguage : SupportedLanguage) => {
    return await WineryLanguage.create({
        wineryId : wineryId, 
        supportedLanguage : supportedLanguage
    }).save()
    
}

const deleteSupportedLanguajeToWinery = async (wineryId : number, supportedLanguage : SupportedLanguage) => {
    return await WineryLanguage.delete({
        wineryId: wineryId,
        supportedLanguage: supportedLanguage
    });
}

export default {
    getWineryLanguageByWineryId,
    insertSupportedLanguajeToWinery,
    deleteSupportedLanguajeToWinery,
}