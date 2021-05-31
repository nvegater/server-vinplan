import argon2 from 'argon2'
import {Winery} from "../../entities/Winery";
import {WineType} from "../../entities/WineType";
import {WineProductionType} from "../../entities/WineProductionType";
import {WineryLanguage} from "../../entities/WineryLanguage";
import {WineryAmenity} from "../../entities/WineryAmenity";
import {User} from "../../entities/User";
import {FieldError, WineryResponse} from "../../resolvers/User/userResolversOutputs";
import {RegisterInputs, UserType, WineryDataInputs, validateInputsRegister} from "../../resolvers/User/userResolversInputs";
import userResolversErrors from "../../resolvers/User/userResolversErrors";

const registerWinery = async (registerInputs : RegisterInputs, wineryDataInputs : WineryDataInputs, userId : number): Promise<WineryResponse> => {
    try {
        const inputErrors: FieldError[] = validateInputsRegister(registerInputs);
        inputErrors.push(...validateInputsRegister(registerInputs))
        if (inputErrors.length > 0) {
            // Level 1: Simple input validation
            return {errors: inputErrors}
        }
        const userWithUsernameExists: User | undefined = await User.findOne({where: {username: registerInputs.username}});
        if (userWithUsernameExists) {
            // Level 1
            return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)}
        } else {
            const userWithEmailExists: User | undefined = await User.findOne({where: {email: registerInputs.email}});
            if (userWithEmailExists) {
                // Level 2
                return {errors: inputErrors.concat(userResolversErrors.emailInUseError)}
            } else {
                const wineryWithThatNameExists: Winery | undefined = await Winery.findOne({where: {name: wineryDataInputs.name}});
                if (wineryWithThatNameExists) {
                    // Level 3
                    return {errors: inputErrors.concat(userResolversErrors.usernameInUseError)} // TODO add winery errors
                } else {

                    const user = User.create({
                        username: registerInputs.username,
                        email: registerInputs.email,
                        password: await argon2.hash(registerInputs.password),
                        visitorOrOwner: true, // From here, logic is different than normal registry
                        userType: UserType.WINERY_OWNER,
                    });
                    await user.save();
                    const creatorId = user.id;
                    const winery = Winery.create({
                            name: wineryDataInputs.name,
                            description: wineryDataInputs.description,
                            foundationYear: wineryDataInputs.foundationYear,
                            googleMapsUrl: !!wineryDataInputs.googleMapsUrl ? wineryDataInputs.googleMapsUrl : "",
                            yearlyWineProduction: wineryDataInputs.yearlyWineProduction,
                            creatorId: creatorId,
                            contactEmail: wineryDataInputs.contactEmail,
                            contactPhoneNumber: wineryDataInputs.contactPhoneNumber,
                            valley: wineryDataInputs.valley,
                            covidLabel : wineryDataInputs.covidLabel
                        }
                    )
                    await winery.save();

                    const wineTypes = wineryDataInputs.wineType.map((wineType) => {
                        return WineType.create({
                            wineryId: winery.id,
                            wineType: wineType,
                        })
                    })

                    wineTypes.map(async (wineTypeEntity) => {
                        await wineTypeEntity.save();
                    })

                    const productionTypes = wineryDataInputs.productionType.map((productionType) => {
                        return WineProductionType.create({
                            wineryId: winery.id,
                            productionType: productionType
                        })
                    })

                    productionTypes.map(async (productionTypeEntity) => {
                        await productionTypeEntity.save();
                    })

                    if (wineryDataInputs.supportedLanguages && wineryDataInputs.supportedLanguages?.length > 0) {
                        wineryDataInputs.supportedLanguages.map(async (supLan) => {
                            const wineLanEntity = WineryLanguage.create({
                                wineryId: winery.id,
                                supportedLanguage: supLan
                            });
                            await wineLanEntity.save()
                        });
                    }

                    if (wineryDataInputs.amenities && wineryDataInputs.amenities?.length > 0) {
                        wineryDataInputs.amenities.map(async (amenity) => {
                            const amenityEntity = WineryAmenity.create({
                                wineryId: winery.id,
                                amenity: amenity
                            });
                            await amenityEntity.save()
                        });
                    }
                    // @ts-ignore
                    req.session.userId = userId;
                    return {winery: winery}
                }
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export default registerWinery;