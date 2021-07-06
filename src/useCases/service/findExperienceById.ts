import {FindExperienceResponse} from "../../resolvers/Service/serviceResolversOutputs";
import dataServices from "../../dataServices/service";
import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery"
import getImageCover from "../../utils/getImageCover";
import wineryServices from "../../dataServices/winery"
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import WineTypeServices from "../../dataServices/wineType";
import WineProductionTypeServices from "../../dataServices/wineProductionType";
import WineryLanguageServices from "../../dataServices/wineryLanguage";
import WineryAmenityServices from "../../dataServices/wineryAmenity";
import {convertDateToUTC} from "../../utils/dateUtils";

const findExperienceById = async (experienceId : number): Promise<FindExperienceResponse> => {
    try {
        const experienceFound = await dataServices.findServiceById(experienceId);
        if (experienceFound != undefined) {
            experienceFound.startDateTime = convertDateToUTC(experienceFound.startDateTime);
            experienceFound.endDateTime = convertDateToUTC(experienceFound.endDateTime);
            experienceFound.gallery = await ServiceImageGalleryServices.getServiceGalleryById(experienceFound?.id);
            experienceFound.urlImageCover = await getImageCover.experience(experienceFound);
            const wineryFound:any = await wineryServices.findWineryById(experienceFound.wineryId);
            const wineTypesOfWinery: WineType[] | [] = await WineTypeServices.getWineTypeByWineryId(wineryFound?.id);
            const prodTypesOfWinery: WineProductionType[] | [] = await WineProductionTypeServices.getProductionTypeByWineryId(wineryFound?.id);
            const languages: WineryLanguage[] | [] = await WineryLanguageServices.getWineryLanguageByWineryId(wineryFound?.id);
            const amenities: WineryAmenity[] | [] = await WineryAmenityServices.getWineryAmenityByWineryId(wineryFound?.id);
            
            return {
                service : experienceFound,
                winery: {
                    ...wineryFound,
                    wineType: wineTypesOfWinery.map((wt)=>wt.wineType),
                    productionType: prodTypesOfWinery.map((pt)=>pt.productionType),
                    supportedLanguages: languages.map((lan)=>lan.supportedLanguage),
                    amenities: amenities.map((amen) => amen.amenity)
                },
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