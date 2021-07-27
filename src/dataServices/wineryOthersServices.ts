import {WineryOtherServices, OtherServices} from "../entities/WineryOtherServices";


const getWineryOtherServicesById = async (wineryId : number) => {
    return await WineryOtherServices.find({
        where: {wineryId: wineryId}
    })
}

const insertOtherServiceToWinery = async (wineryId : number, othersService : OtherServices) => {
    console.log(othersService);
    return await WineryOtherServices.create({
        wineryId : wineryId
    }).save()
    
}

const deleteOtherServiceToWinery = async (wineryId : number, othersService : OtherServices) => {
    console.log(othersService);
    return await WineryOtherServices.delete({
        wineryId: wineryId
    });
}

export default {
    getWineryOtherServicesById,
    insertOtherServiceToWinery,
    deleteOtherServiceToWinery,
}