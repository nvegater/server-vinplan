import {WineryImageGallery} from "../entities/WineryImageGallery"

const insertImageInWineryGallery = async (wineryId: number, urlImage: string) => {
    const wineryImage = WineryImageGallery.create({ 
        wineryId: wineryId,
        imageUrl: urlImage 
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

export default {
    insertImageInWineryGallery,
    getWineryGalleryById,
    getImagesNumberGallery,
}