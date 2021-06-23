import {ServiceImageResponse} from "../../resolvers/Service/serviceResolversOutputs"
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import {EventType} from "../../entities/Service";

const deleteDefaultImageToEvent = async (eventType: EventType): Promise<ServiceImageResponse> => {
    try {
        const serviceInserted = await ServiceImageGalleryServices.deleteDefaultPictureToEvent(eventType)
        if (serviceInserted === undefined) {
            return {errors: [{
                field: 'imageId',
                message : "Fallo al eliminar"
            }], success : false}
        } else {
            return {success: true}; 
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default deleteDefaultImageToEvent;