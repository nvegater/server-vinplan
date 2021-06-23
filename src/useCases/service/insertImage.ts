import {ServiceImageResponse} from "../../resolvers/Service/serviceResolversOutputs"
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"

const insertImage = async (serviceId: number, urlImage: string): Promise<ServiceImageResponse> => {
    try {
        const serviceInserted = await ServiceImageGalleryServices.insertImageInServiceGallery(serviceId, urlImage)
        
        if (serviceInserted === undefined) {
            return {errors: [{
                field: 'imageId',
                message : "La imagen no se puede borrar"
            }], success : false}
        } else {
            await ServiceImageGalleryServices.getServiceGalleryById(serviceId)
            return {success: true}; 
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default insertImage;