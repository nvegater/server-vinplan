import {ServiceImageGallery} from "../entities/ServiceImageGallery"
import {getConnection} from "typeorm";
import {EventType} from "../entities/Service";
import {ServiceDefaultImage} from "../entities/ServiceDefaultImage";

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

const findDefaultImageByEventType = async (eventType: EventType) => {
    return await ServiceDefaultImage.findOne({where: {eventType: eventType}});
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

const insertDefaultPictureToEvent = async (eventType: EventType, urlImage: string) => {
    const serviceImage = ServiceDefaultImage.create({ 
        defaultImageUrl: urlImage,
        eventType : eventType,
    })
    return await serviceImage.save()
}

const deleteDefaultPictureToEvent = async (eventId: number) => {
    return await ServiceDefaultImage.delete(eventId)
}

const updateDefaultPictureToEvent = async (eventType: EventType, urlImage: string) => {
    return await getConnection().createQueryBuilder()
        .update(ServiceDefaultImage)
        .set({
            defaultImageUrl: urlImage
        })
        .where('eventType = :eventType', {eventType: eventType})
        .returning("*")
        .execute();
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
    insertImageInServiceGallery, getCoverImageGallery,
    getServiceGalleryById, getImagesNumberGallery,
    selectCoverPageImage,unSelectCoverPageImage,
    findImageById, deleteImageById, findDefaultImageByEventType,
    insertDefaultPictureToEvent, updateDefaultPictureToEvent, deleteDefaultPictureToEvent
}