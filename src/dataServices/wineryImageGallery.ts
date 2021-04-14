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

export default {
    insertImageInWineryGallery,
    getWineryGalleryById,
}