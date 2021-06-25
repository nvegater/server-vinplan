import {ServiceImageGallery} from "../entities/ServiceImageGallery"
import {getConnection} from "typeorm";

const insertImageInServiceGallery = async (serviceId: number, urlImage: string, coverPage: boolean) => {
    const serviceImage = ServiceImageGallery.create({ 
        serviceId: serviceId,
        imageUrl: urlImage,
        coverPage : coverPage,
    })
    return await serviceImage.save()
}

const findImageById = async (imageId: number) => {
    return await ServiceImageGallery.findOne(imageId);
}

const deleteImageById = async (imageId: number) => {
    return await ServiceImageGallery.delete(imageId);
}

const getServiceGalleryById = async(serviceId: number) => {
    return ServiceImageGallery.find({
        where: {serviceId: serviceId}
    })
}

const getImagesNumberGallery = async(serviceId: number) => {
    return await ServiceImageGallery.count({ serviceId });
}

const selectCoverPageImage = async(serviceImageId: number) => {
    return await getConnection().createQueryBuilder()
        .update(ServiceImageGallery)
        .set({
            coverPage: true
        })
        .where('id = :serviceImageId', {wineryImageId: serviceImageId})
        .returning("*")
        .execute();
}

const unSelectCoverPageImage = async(serviceId: number) => {
    return await getConnection().createQueryBuilder()
        .update(ServiceImageGallery)
        .set({
            coverPage: false
        })
        .where('serviceId = :serviceId and coverPage = :coverPage', {serviceId: serviceId, coverPage: true})
        .returning("*")
        .execute();
}

const getCoverImageGallery = async(serviceId: number) => {
    return ServiceImageGallery.findOne({
        where: {serviceId: serviceId, coverPage: true}
    })
}

export default {
    insertImageInServiceGallery,
    getServiceGalleryById,
    getImagesNumberGallery,
    selectCoverPageImage,
    unSelectCoverPageImage,
    findImageById,
    deleteImageById,
    getCoverImageGallery
}