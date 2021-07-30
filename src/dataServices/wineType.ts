import {WineType, TypeWine} from "../entities/WineType"

const getWineTypeByWineryId = async (wineryId: number) => {
    return await WineType.find({
        where: {wineryId: wineryId}
    });
} 

const insertWineTypeToWinery = async (wineryId : number, typeWine : TypeWine) => {
    return await WineType.create({
        wineryId : wineryId, 
        wineType: typeWine,
    }).save()
    
}

const deleteWineTypeToWinery = async (wineryId : number, typeWine : TypeWine) => {
    return await WineType.delete({
        wineryId: wineryId, 
        wineType: typeWine,
    });
}

export default {
    getWineTypeByWineryId,
    insertWineTypeToWinery,
    deleteWineTypeToWinery,
}