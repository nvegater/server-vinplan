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
    const wineryImageCover = await WineryImageGallery.findOne({wineryId : wineryId, coverPage : true}) || null;
    if (wineryImageCover) {
        wineryImageCover.coverPage = false;
        await wineryImageCover.save()
    } 
    const wineryImageSelected = await WineryImageGallery.findOne({id : wineryImageId}) || null;
    if (wineryImageSelected) {
        wineryImageSelected.coverPage = true;
        await wineryImageSelected.save()
    } else {
        return {error : true, reason : 'imageNotFound'}
    }
    return {error : false};
}

export default {
    insertImageInWineryGallery,
    getWineryGalleryById,
    getImagesNumberGallery,
    changeCoverPage
}