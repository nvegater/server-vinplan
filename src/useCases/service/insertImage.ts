import {ServiceInsertImageResponse} from "../../resolvers/Service/serviceResolversOutputs"
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import {ServiceImageGallery} from "../../entities/ServiceImageGallery"

const insertImage = async (serviceId: number, urlImages: string[]): Promise<ServiceInsertImageResponse> => {
    try {
        const serviceImageArray : ServiceImageGallery[] = []
        await urlImages.forEach(async (image) => { 
            const serviceInserted = await ServiceImageGalleryServices.insertImageInServiceGallery(serviceId, image)
            serviceImageArray.push(serviceInserted)
        });
        
        if (serviceImageArray.length != urlImages.length) {
            return {inserted : true}
        }
        else {
            return {errors: []}
        }
        
    } catch (error) {
        throw new Error(error)
    }
}

export default insertImage;