import {WineryImageGallery} from "../entities/WineryImageGallery"
import {getConnection} from "typeorm";

const insertImageInWineryGallery = async (wineryId: number, urlImage: string) => {
    const wineryFound = await WineryImageGallery.find({wineryId: wineryId})
    const wineryImage = WineryImageGallery.create({ 
        wineryId: wineryId,
        imageUrl: urlImage,
        coverPage : !wineryFound.length,
    })
    return await wineryImage.save()
}

const findImageById = async (imageId: number) => {
    return await WineryImageGallery.findOne(imageId);
}

const getWineryGalleryById = async(wineryId: number) => {
    return WineryImageGallery.find({
        where: {wineryId: wineryId}
    })
}

const getImagesNumberGallery = async(wineryId: number) => {
    return await WineryImageGallery.count({ wineryId });
}

const selectCoverPageImage = async(wineryImageId: number) => {
    return await getConnection().createQueryBuilder()
        .update(WineryImageGallery)
        .set({
            coverPage: true
        })
        .where('id = :wineryImageId', {wineryImageId: wineryImageId})
        .returning("*")
        .execute();
}

const unSelectCoverPageImage = async(wineryId: number) => {
    return await getConnection().createQueryBuilder()
        .update(WineryImageGallery)
        .set({
            coverPage: false
        })
        .where('wineryId = :wineryId and coverPage = :coverPage', {wineryId: wineryId, coverPage: true})
        .returning("*")
        .execute();
}

export default {
    insertImageInWineryGallery,
    getWineryGalleryById,
    getImagesNumberGallery,
    selectCoverPageImage,
    unSelectCoverPageImage,
    findImageById
}