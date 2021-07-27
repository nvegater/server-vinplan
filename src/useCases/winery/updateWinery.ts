import WineryServices from "../../dataServices/winery";
import {FieldError} from "../../resolvers/User/userResolversOutputs";
import {UpdateWineryInputs} from "../../resolvers/Winery/wineryResolversInputs"
import {WineryServicesResponse} from "../../resolvers/Winery/wineryResolversOutputs";
import WineryGrapesServicesResponse from "../../dataServices/wineryGrapes";
import {Grape} from "../../entities/WineGrapesProduction"
import WineryOtherServicesResponse from "../../dataServices/wineryOthersServices";
import {OtherServices} from "../../entities/WineryOtherServices"
import WineProductionTypeServices from "../../dataServices/wineProductionType";
import {ProductionType} from "../../entities/WineProductionType"
import WineTypeServices from "../../dataServices/wineType";
import {TypeWine} from "../../entities/WineType"

import {arrayAreEquals, getDifferentsElements} from "../../utils/arrayUtilities"

const updateWinery = async(updateWineryInputs : UpdateWineryInputs) : Promise<WineryServicesResponse> => {
    try {
        //TODO: refactorizar
        const winery:any = await saveWineryWithOwnData(updateWineryInputs)

        const arrayPromises = [];

        if (updateWineryInputs.wineGrapesProduction) {
            arrayPromises.push(saveWineryGrapesProduction(updateWineryInputs.id, updateWineryInputs.wineGrapesProduction))
        }
        
        if (updateWineryInputs.othersServices) {
            arrayPromises.push(saveWineryOtherServices(updateWineryInputs.id, updateWineryInputs.othersServices))
        }

        if (updateWineryInputs.productionType) {
            arrayPromises.push(saveWineryProductionType(updateWineryInputs.id, updateWineryInputs.productionType))
        }

        if (updateWineryInputs.wineType){
            arrayPromises.push(saveWineryWineType(updateWineryInputs.id, updateWineryInputs.wineType))
        }


        await Promise.all(arrayPromises);

        //winery.productionType = updateWineryInputs.productionType;
        //winery.wineType = updateWineryInputs.wineType;
        //winery.supportedLanguages = updateWineryInputs.supportedLanguages;
        //winery.amenities = updateWineryInputs.amenities;
        if (winery) {
            return {
                winery: {
                    ...winery,
                    wineType: [],
                    productionType: [],
                    supportedLanguages: [],
                    amenities: []
                },
                images: [],
                services: []
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

const saveWineryGrapesProduction = async (id : number, wineGrapesProduction:Grape[]) => {
    const wineGrapesF = await WineryGrapesServicesResponse.getWineGrapesById(id);
    const wineGrapesFound = wineGrapesF.map(grapes => grapes.wineGrapesProduction);
    if (!arrayAreEquals(wineGrapesFound, wineGrapesProduction)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(wineGrapesProduction,wineGrapesFound)
        .forEach(async (grape) => {
            await WineryGrapesServicesResponse.insertGrapesToWinery(id, grape)
        })
        //se van a eliminar 
        getDifferentsElements(wineGrapesFound, wineGrapesProduction)
        .forEach(async (grape) => await WineryGrapesServicesResponse.deleteGrapesToWinery(id, grape))
    }
}

const saveWineryOtherServices = async (id : number, othersServices:OtherServices[]) => {
    const servicesF = await WineryOtherServicesResponse.getWineryOtherServicesById(id);
    const servicesFound = servicesF.map(oServices => oServices.service);
    
    if (!arrayAreEquals(servicesFound, othersServices)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(othersServices,servicesFound)
        .forEach(async (service) => {
            await WineryOtherServicesResponse.insertOtherServiceToWinery(id, service)
        })
        //se van a eliminar 
        getDifferentsElements(servicesFound, othersServices)
        .forEach(async (service) => await WineryOtherServicesResponse.deleteOtherServiceToWinery(id, service))
    }
}

const saveWineryProductionType = async (id : number, productionType:ProductionType[]) => {
    const productionTypesF = await WineProductionTypeServices.getProductionTypeByWineryId(id);
    const productionTypesFound = productionTypesF.map(prodType => prodType.productionType);
    
    if (!arrayAreEquals(productionTypesFound, productionType)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(productionType,productionTypesFound)
        .forEach(async (productionT) => {
            await WineProductionTypeServices.insertProductionTypeToWinery(id, productionT)
        })
        //se van a eliminar 
        getDifferentsElements(productionTypesFound, productionType)
        .forEach(async (productionT) => await WineProductionTypeServices.deleteProductionTypeToWinery(id, productionT))
    }
}

const saveWineryWineType = async (id : number, wineType:TypeWine[]) => {
    const wineTypesF = await WineTypeServices.getWineTypeByWineryId(id)
    const wineTypesFound = wineTypesF.map(wineType => wineType.wineType);
    
    if (!arrayAreEquals(wineTypesFound, wineType)){
        //son diferentes
        //se van a insertar
        getDifferentsElements(wineType,wineTypesFound)
        .forEach(async (wineT) => {
            await WineTypeServices.insertWineTypeToWinery(id, wineT)
        })
        //se van a eliminar 
        getDifferentsElements(wineTypesFound, wineType)
        .forEach(async (wineT) => await WineTypeServices.deleteWineTypeToWinery(id, wineT))
    }
}

const saveWineryWithOwnData = async (updateWineryInputs: UpdateWineryInputs) => {
    try {
        const winery: any = await WineryServices.findWineryById(updateWineryInputs.id);
        winery.id = updateWineryInputs.id;
        winery.name = updateWineryInputs.name;
        winery.description = updateWineryInputs.description;
        winery.foundationYear = updateWineryInputs.foundationYear;
        winery.googleMapsUrl = updateWineryInputs.googleMapsUrl;
        winery.yearlyWineProduction = updateWineryInputs.yearlyWineProduction;
        winery.contactEmail = updateWineryInputs.contactEmail;
        winery.contactPhoneNumber = updateWineryInputs.contactPhoneNumber;
        winery.covidLabel = updateWineryInputs.covidLabel;
        winery.logo = updateWineryInputs.logo;
        winery.contactName = updateWineryInputs.contactName;
        winery.productRegion = updateWineryInputs.productRegion;
        winery.postalAddress = updateWineryInputs.postalAddress;
        winery.architecturalReferences = updateWineryInputs.architecturalReferences;
        winery.enologoName = updateWineryInputs.enologoName;
        winery.younerFriendly = updateWineryInputs.younerFriendly;
        winery.petFriendly = updateWineryInputs.petFriendly;
        winery.handicappedFriendly = updateWineryInputs.handicappedFriendly;
        winery.valley = updateWineryInputs.valley;
        const wineryUpdated = await WineryServices.updateWinery(winery);
        console.log(wineryUpdated);
        return winery;
    } catch (error) {
        throw new Error(error);
    }
    
}

export default updateWinery;







// const wineryId = updateWineryInputs.id
        // const wineryWithServices = await ServiceServices.findServicesByWinery(wineryId);
        
        // const coverImages = await Promise.all(wineryWithServices.map(async (ser) => {
        //     const imageSelected = await ServiceGalleryServices.getCoverImageGallery(ser.id) || undefined
        //     if (imageSelected) {
        //         return imageSelected.imageUrl
        //     } else {
        //         const defaultData = await ServiceGalleryServices.findDefaultImageByEventType(ser.eventType)
        //         return defaultData?.defaultImageUrl
        //     }
        // }))

        // // correct dates to UTC
        // const servicesWithUTCDates:Service[] = wineryWithServices.map((ser,i)=>{
             
        //     ser.startDateTime = convertDateToUTC(ser.startDateTime);
        //     ser.endDateTime = convertDateToUTC(ser.endDateTime);
        //     //TODO: buscar imagen por defecto para cover  
        //     ser.urlImageCover = coverImages[i];
        //     return ser
        // })
        // const winery:any = await WineryServices.findWineryById(wineryId);
        // const wineryImages: WineryImageGallery[] | undefined  = await WineryImageGalleryServices.getWineryGalleryById(wineryId)

        // let wineryWithOutCoverPage = true;
        // wineryImages.forEach(image => {
        //     // se pregunta si no existe el campo coverImage se genera como false
        //     // si existe y es true no se modifica
        //     if (image.coverPage != true) {
        //         image["coverPage"] = false;
        //     // si encuentro una imagen como cover
        //     } else {
        //         wineryWithOutCoverPage = false
        //     }
        // });

        // if (wineryWithOutCoverPage && wineryImages.length > 0) {
        //     wineryImages[0].coverPage = true;
        // }

        // if (servicesWithUTCDates && winery) {
        //     const wineTypesOfWinery: WineType[] | undefined = await WineTypeServices.getWineTypeByWineryId(winery.id)
        //     const prodTypesOfWinery: WineProductionType[] | undefined = await WineProductionTypeServices.getProductionTypeByWineryId(winery.id)

        //     const languages: WineryLanguage[] | undefined = await WineryLanguageServices.getWineryLanguageByWineryId(winery.id)

        //     const amenities: WineryAmenity[] | undefined = await WineryAmenityServices.getWineryAmenityByWineryId(winery.id)

        //     return {
        //         winery: {
        //             ...winery,
        //             wineType: wineTypesOfWinery.map((wt)=>wt.wineType),
        //             productionType: prodTypesOfWinery.map((pt)=>pt.productionType),
        //             supportedLanguages: languages.map((lan)=>lan.supportedLanguage),
        //             amenities: amenities.map((amen) => amen.amenity)
        //         },
        //         images: wineryImages,
        //         services: servicesWithUTCDates
        //     }
        // } else {
        //     const fieldError: FieldError = {
        //         field: "Winery with services",
        //         message: "Not services found for this winery"
        //     }
        //     return {
        //         errors: [fieldError]
        //     }
        // }