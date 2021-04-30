import ServiceServices from "../../dataServices/service";
import WineryServices from "../../dataServices/winery";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";
import WineTypeServices from "../../dataServices/wineType";
import WineProductionTypeServices from "../../dataServices/wineProductionType";
import WineryLanguageServices from "../../dataServices/wineryLanguage";
import WineryAmenityServices from "../../dataServices/wineryAmenity";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {FieldError} from "../../resolvers/User/userResolversOutputs";
import {WineryServicesResponse} from "../../resolvers/Winery/wineryResolversOutputs";

import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineType} from "../../entities/WineType"

const getWineryWithServices = async(wineryId : number) : Promise<WineryServicesResponse> => {
    try {
        const wineryWithServices = await ServiceServices.getServiceByWinery(wineryId)
        const winery:any = await WineryServices.findWineryById(wineryId);
        const wineryImages: WineryImageGallery[] | undefined  = await WineryImageGalleryServices.getWineryGalleryById(wineryId)

        let wineryWithOutCoverPage = true;
        wineryImages.forEach(image => {
            // se pregunta si no existe el campo coverImage se genera como false
            // si existe y es true no se modifica
            if (image.coverPage != true) {
                image["coverPage"] = false;
            // si encuentro una imagen como cover
            } else {
                wineryWithOutCoverPage = false
            }
        });

        if (wineryWithOutCoverPage && wineryImages.length > 0) {
            wineryImages[0].coverPage = true;
        }

        if (wineryWithServices && winery) {
            const wineTypesOfWinery: WineType[] | undefined = await WineTypeServices.getWineTypeByWineryId(winery.id)
            const prodTypesOfWinery: WineProductionType[] | undefined = await WineProductionTypeServices.getProductionTypeByWineryId(winery.id)

            const languages: WineryLanguage[] | undefined = await WineryLanguageServices.getWineryLanguageByWineryId(winery.id)

            const amenities: WineryAmenity[] | undefined = await WineryAmenityServices.getWineryAmenityByWineryId(winery.id)

            return {
                winery: {
                    ...winery,
                    wineType: wineTypesOfWinery.map((wt)=>wt.wineType),
                    productionType: prodTypesOfWinery.map((pt)=>pt.productionType),
                    supportedLanguages: languages.map((lan)=>lan.supportedLanguage),
                    amenities: amenities.map((amen) => amen.amenity)
                },
                images: wineryImages,
                services: wineryWithServices
            }
        } else {
            const fieldError: FieldError = {
                field: "Winery with services",
                message: "Not services found for this winery"
            }
            return {
                errors: [fieldError]
            }
        }
    } catch (error) {
        throw new Error(error)
    }
};

export default getWineryWithServices;
