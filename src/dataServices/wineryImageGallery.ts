import {WineryImageGallery} from "../entities/WineryImageGallery"

const insertImageInWineryGallery = async (wineryId: number, urlImage: string) => {

    const wineryFound = await WineryImageGallery.find({wineryId: wineryId})
    const wineryImage = WineryImageGallery.create({ 
        wineryId: wineryId,
        imageUrl: urlImage,
        coverPage : !wineryFound.length,
    })
    const newWineryImage = await wineryImage.save();
    return newWineryImage
} 

const getWineryGalleryById = async(wineryId: number) => {
    return WineryImageGallery.find({
        where: {wineryId: wineryId}
    })
}

const getImagesNumberGallery = async(wineryId: number) => {
    return await WineryImageGallery.count({ wineryId });
}

const changeCoverPage = async(wineryId: number, wineryImageId: number) => {
    console.log(wineryImageId);
    const wineries = await WineryImageGallery.findOne({wineryId : wineryId, coverPage : true})
    console.log(wineries);
}

export default {
    insertImageInWineryGallery,
    getWineryGalleryById,
    getImagesNumberGallery,
    changeCoverPage
}