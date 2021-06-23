import {deleteImageFromS3} from "../../utils/s3Utilities"
import {ServiceImageResponse} from "../../resolvers/Service/serviceResolversOutputs";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"

const deleteImage = async (serviceId : number): Promise<ServiceImageResponse> => {
    try {
        let deleteImage;
        const imageFound = await ServiceImageGalleryServices.findImageById(serviceId);
            if (imageFound != undefined) {
                if(imageFound.coverPage){
                    deleteImage = await ServiceImageGalleryServices.deleteImageById(serviceId); 
                    const newCover = await ServiceImageGalleryServices.getServiceGalleryById(imageFound.serviceId);
                    await ServiceImageGalleryServices.selectCoverPageImage(newCover[0].id);
                    await deleteImageFromS3(imageFound.imageUrl); 
                }else{
                    deleteImage = await ServiceImageGalleryServices.deleteImageById(serviceId); 
                    await deleteImageFromS3(imageFound.imageUrl); 
                }
                if (deleteImage){
                    return {success : true}
                } else {
                    return {errors: [{
                        field: 'imageId',
                        message : "La imagen no se puede borrar"
                    }], success : false}
                }
            } else {
                return {errors: [{
                    field: 'imageId',
                    message : "No se encontrò la imagen"
                }], success : false}
            }
    } catch (error) {
        throw new Error(error)
    }
}

export default deleteImage;