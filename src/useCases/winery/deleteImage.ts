import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineryDeleteImageResponse} from "../../resolvers/Winery/wineryResolversOutputs";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery"

const deleteImage = async (imageId : number): Promise<WineryDeleteImageResponse> => {
    try {
        const imageFound = await WineryImageGalleryServices.findImageById(imageId);
            console.log(imageFound);
            if (imageFound === undefined) {
                return {errors: [{
                    field: 'imageId',
                    message : "No se encontrò la imagen"
                }], deleted : false}
            } else {
                const deleteImage = await WineryImageGallery.delete(imageId); 
                if (deleteImage){
                    return {deleted : true}
                } else {
                    return {errors: [{
                        field: 'imageId',
                        message : "La imagen no se puede borrar"
                    }], deleted : false}
                }
            }
    } catch (error) {
        throw new Error(error)
    }
}

export default deleteImage;