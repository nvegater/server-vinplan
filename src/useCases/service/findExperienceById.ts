import {FindExperienceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import dataServices from "../../dataServices/service";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import getImageCover from "../../utils/getImageCover";

const findExperienceById = async (experienceId : number): Promise<FindExperienceResponse> => {
    try {
        const experienceFound = await dataServices.findServiceById(experienceId);
            if (experienceFound != undefined) {
                experienceFound.gallery = await ServiceImageGalleryServices.getServiceGalleryById(experienceFound?.id);
                experienceFound.urlImageCover = await getImageCover.experience(experienceFound);
                return {service : experienceFound}
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