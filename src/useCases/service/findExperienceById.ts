import {FindExperienceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import dataServices from "../../dataServices/service";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import getImageCover from "../../utils/getImageCover";
import wineryServices from "../../dataServices/winery"
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import WineTypeServices from "../../dataServices/wineType"
import WineProductionTypeServices from "../../dataServices/wineProductionType"
import WineryLanguageServices from "../../dataServices/wineryLanguage"
import WineryAmenityServices from "../../dataServices/wineryAmenity"

const findExperienceById = async (experienceId : number): Promise<FindExperienceResponse> => {
    try {
        const experienceFound = await dataServices.findServiceById(experienceId);
            if (experienceFound != undefined) {
                experienceFound.gallery = await ServiceImageGalleryServices.getServiceGalleryById(experienceFound?.id);
                experienceFound.urlImageCover = await getImageCover.experience(experienceFound);
                const wineryFound = await wineryServices.findWineryById(experienceFound.wineryId);
                if (wineryFound) {
                    const wineTypesOfWinery: WineType[] | [] = await WineTypeServices.getWineTypeByWineryId(wineryFound?.id);
                    const prodTypesOfWinery: WineProductionType[] | [] = await WineProductionTypeServices.getProductionTypeByWineryId(wineryFound?.id);
                    const languages: WineryLanguage[] | [] = await WineryLanguageServices.getWineryLanguageByWineryId(wineryFound?.id);
                    const amenities: WineryAmenity[] | [] = await WineryAmenityServices.getWineryAmenityByWineryId(wineryFound?.id);
                    wineryFound.typeProduction = prodTypesOfWinery.map((pt) => pt.productionType);
                    wineryFound.typeWine = wineTypesOfWinery.map((wt) => wt.wineType);
                    wineryFound.languageSupported = languages.map((lang) => lang.supportedLanguage);
                    wineryFound.wineryAmenity = amenities.map((am) => am.amenity);
                }
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