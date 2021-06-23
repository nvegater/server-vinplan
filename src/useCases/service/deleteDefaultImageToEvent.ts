import {ServiceImageResponse} from "../../resolvers/Service/serviceResolversOutputs"
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import {EventType} from "../../entities/Service";

const deleteDefaultImageToEvent = async (eventType: EventType): Promise<ServiceImageResponse> => {
    try {
        const eventDefaultImage = await ServiceImageGalleryServices.findDefaultImageByEventType(eventType);
        if (eventDefaultImage === undefined) {
            return {errors: [{
                field: 'imageId',
                message : "No se encontró el evento"
            }], success : false}
        }else{
            const serviceInserted = await ServiceImageGalleryServices.deleteDefaultPictureToEvent(eventDefaultImage.id);
            if (serviceInserted === undefined) {
                return {errors: [{
                    field: 'imageId',
                    message : "Fallo al eliminar"
                }], success : false}
            } else {
                return {success: true}; 
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default deleteDefaultImageToEvent;