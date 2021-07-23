import ServiceServices from "../../dataServices/service";
import ServiceGalleryServices from "../../dataServices/serviceImageGallery";
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
import {UpdateWineryInputs} from "../../resolvers/Winery/wineryResolversInputs"
import {WineryServicesResponse} from "../../resolvers/Winery/wineryResolversOutputs";

import {WineryImageGallery} from "../../entities/WineryImageGallery"
import {WineType} from "../../entities/WineType"
import {Service} from "../../entities/Service";
import {convertDateToUTC} from "../../utils/dateUtils";

const updateWinery = async(updateWineryInputs : UpdateWineryInputs) : Promise<WineryServicesResponse> => {
    try {
        const wineryId = updateWineryInputs.id
        const wineryWithServices = await ServiceServices.findServicesByWinery(wineryId);
        
        const coverImages = await Promise.all(wineryWithServices.map(async (ser) => {
            const imageSelected = await ServiceGalleryServices.getCoverImageGallery(ser.id) || undefined
            if (imageSelected) {
                return imageSelected.imageUrl
            } else {
                const defaultData = await ServiceGalleryServices.findDefaultImageByEventType(ser.eventType)
                return defaultData?.defaultImageUrl
            }
        }))

        // correct dates to UTC
        const servicesWithUTCDates:Service[] = wineryWithServices.map((ser,i)=>{
             
            ser.startDateTime = convertDateToUTC(ser.startDateTime);
            ser.endDateTime = convertDateToUTC(ser.endDateTime);
            //TODO: buscar imagen por defecto para cover  
            ser.urlImageCover = coverImages[i];
            return ser
        })
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

        if (servicesWithUTCDates && winery) {
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
                services: servicesWithUTCDates
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
    }
    catch (err) {
        throw new Error(err)
    }
}

export default updateWinery;