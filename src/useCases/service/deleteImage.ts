import {deleteImageFromS3} from "../../utils/s3Utilities"
import {ServiceDeleteImageResponse} from "../../resolvers/Service/serviceResolversOutputs";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"

const deleteImage = async (serviceId : number): Promise<ServiceDeleteImageResponse> => {
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
                    return {deleted : true}
                } else {
                    return {errors: [{
                        field: 'imageId',
                        message : "La imagen no se puede borrar"
                    }], deleted : false}
                }
            } else {
                return {errors: [{
                    field: 'imageId',
                    message : "No se encontrò la imagen"
                }], deleted : false}
            }
    } catch (error) {
        throw new Error(error)
    }
}

export default deleteImage;