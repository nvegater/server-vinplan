import {deleteImageFromS3} from "../../utils/s3Utilities"
import {WineryDeleteImageResponse} from "../../resolvers/Winery/wineryResolversOutputs";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"

const deleteImage = async (imageId : number): Promise<WineryDeleteImageResponse> => {
    try {
        let deleteImage;
        const imageFound = await WineryImageGalleryServices.findImageById(imageId);
            if (imageFound != undefined) {
                if(imageFound.coverPage){
                    deleteImage = await WineryImageGalleryServices.deleteImageById(imageId); 
                    const newCover = await WineryImageGalleryServices.getWineryGalleryById(imageFound.wineryId);
                    await WineryImageGalleryServices.selectCoverPageImage(newCover[0].id);
                    await deleteImageFromS3(imageFound.imageUrl); 
                }else{
                    deleteImage = await WineryImageGalleryServices.deleteImageById(imageId); 
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