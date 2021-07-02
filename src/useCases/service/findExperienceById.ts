import {FindExperienceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import dataServices from "../../dataServices/service";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import getImageCover from "../../utils/getImageCover";
import wineryServices from "../../dataServices/winery"

const findExperienceById = async (experienceId : number): Promise<FindExperienceResponse> => {
    try {
        const experienceFound = await dataServices.findServiceById(experienceId);
            if (experienceFound != undefined) {
                experienceFound.gallery = await ServiceImageGalleryServices.getServiceGalleryById(experienceFound?.id);
                experienceFound.urlImageCover = await getImageCover.experience(experienceFound);
                const wineryFound = await wineryServices.findWineryById(experienceFound.wineryId)
                return {
                    service : experienceFound,
                    winery : wineryFound
                }
            } else {
                return {errors: [{
                    field: 'experienceId',
                    message : "No se encontró la experiencia"
                }]}
            }
    } catch (error) {
        throw new Error(error)
    }
}

export default findExperienceById;