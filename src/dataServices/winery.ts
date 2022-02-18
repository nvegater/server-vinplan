import { Valley, Winery } from "../entities/Winery";
import {
  CreateWineryInputs,
  EditWineryInputs,
} from "../resolvers/Inputs/CreateWineryInputs";
import { UserInputs } from "../resolvers/Inputs/UserInputs";
import { TypeWine, WineType } from "../entities/WineType";
import { getConnection, getRepository } from "typeorm";
import { typeReturn } from "./utils";
import {
  ProductionType,
  WineProductionType,
} from "../entities/WineProductionType";
import { SupportedLanguage, WineryLanguage } from "../entities/WineryLanguage";
import { Amenity, WineryAmenity } from "../entities/WineryAmenity";

export const getWineryByUsername_DS = async (creatorUsername: string) => {
  return await Winery.findOne({
    relations: [
      "productionType",
      "wineType",
      "supportedLanguages",
      "amenities",
    ],
    where: {
      creatorUsername: creatorUsername,
    },
  });
};

export const getWineryByAlias_DS = async (urlAlias: string) => {
  return await Winery.findOne({
    relations: [
      "productionType",
      "wineType",
      "supportedLanguages",
      "amenities",
    ],
    where: {
      urlAlias: urlAlias,
    },
  });
};

export const getWineryNameByExperienceId = async (experienceId: number) => {
  const qs = getRepository(Winery)
    .createQueryBuilder("winery")
    .leftJoinAndSelect("winery.experiences", "experience")
    .where("experience.id = :experienceId", { experienceId });

  const winery = await qs.getOne();

  return winery == null ? null : winery.name;
};

export const getWineryById_DS = async (id: number) => {
  return await Winery.findOne(id);
};

interface CreateWineryProps_DS {
  wineryInputs: CreateWineryInputs;
  user: UserInputs;
  stripeCustomerId: string;
}
type CreateWineryFn_DS = (props: CreateWineryProps_DS) => Promise<Winery>;
export const createWinery_DS: CreateWineryFn_DS = async ({
  wineryInputs,
  user,
  stripeCustomerId,
}) => {
  const wineryEntity = Winery.create({
    ...wineryInputs,
    stripe_customerId: stripeCustomerId,
    creatorUsername: user.username,
    creatorEmail: user.email,
    subscription: wineryInputs.subscription,
    wineType: [],
    productionType: [],
    supportedLanguages: [],
    amenities: [],
  });
  await wineryEntity.save();

  const wineTypes = wineryInputs.wineType.map((wineType) => {
    return WineType.create({
      wineryId: wineryEntity.id,
      wineType: wineType,
    });
  });

  await Promise.all(
    wineTypes.map(async (wineTypeEntity) => {
      await wineTypeEntity.save();
    })
  );
  wineryEntity.wineType = wineTypes;

  const productionTypes = wineryInputs.productionType.map((prodType) => {
    return WineProductionType.create({
      wineryId: wineryEntity.id,
      productionType: prodType,
    });
  });

  await Promise.all(
    productionTypes.map(async (e) => {
      await e.save();
    })
  );
  wineryEntity.productionType = productionTypes;

  const languages = wineryInputs.supportedLanguages
    ? wineryInputs.supportedLanguages.map((language) => {
        return WineryLanguage.create({
          wineryId: wineryEntity.id,
          supportedLanguage: language,
        });
      })
    : [];

  await Promise.all(
    languages.map(async (e) => {
      await e.save();
    })
  );
  wineryEntity.supportedLanguages = languages;

  const amenities = wineryInputs.amenities
    ? wineryInputs.amenities.map((amen) => {
        return WineryAmenity.create({
          wineryId: wineryEntity.id,
          amenity: amen,
        });
      })
    : [];

  await Promise.all(
    amenities.map(async (e) => {
      await e.save();
    })
  );

  wineryEntity.amenities = amenities;

  await wineryEntity.save();

  return wineryEntity;
};

export const updateWineryAccountID_DS = async (
  accountId: string,
  wineryAlias: string
): Promise<Winery> => {
  return await typeReturn<Winery>(
    getConnection()
      .createQueryBuilder()
      .update(Winery)
      .set({ accountId: accountId })
      .where("urlAlias = :wineryAlias", {
        wineryAlias,
      })
      .returning("*")
      .execute()
  );
};

export async function getAllWineriesNames(): Promise<string[]> {
  const qs = getRepository(Winery)
    .createQueryBuilder("winery")
    .select(["name"]);

  const wineryNames = await qs.getRawMany();
  return wineryNames.map((e) => e.name);
}

async function addProductionTypeIfMissing(
  newPt: ProductionType,
  wineryId: number
) {
  // find all Prd Types
  const currentWineProductionTypes: WineProductionType[] =
    await WineProductionType.find({
      where: { wineryId },
    });
  const ptNotIncluded = !currentWineProductionTypes
    .map((e) => e.productionType)
    .includes(newPt);
  if (ptNotIncluded) {
    const newProdType = WineProductionType.create({
      wineryId,
      productionType: newPt,
    });
    await newProdType.save();
  }
}

async function addWineTypeIfMissing(newWineType: TypeWine, wineryId: number) {
  // find all Wine Types
  const currWineTypes: WineType[] = await WineType.find({
    where: { wineryId },
  });
  const wTNotIncluded = !currWineTypes
    .map((e) => e.wineType)
    .includes(newWineType);
  if (wTNotIncluded) {
    const addWineType = WineType.create({ wineryId, wineType: newWineType });
    await addWineType.save();
  }
}

async function addSupportedLanguageIfMissing(
  newSL: SupportedLanguage,
  wineryId: number
) {
  // find all Supp Languages
  const currSupportedLanguages: WineryLanguage[] = await WineryLanguage.find({
    where: { wineryId },
  });
  const sLNotIncluded = !currSupportedLanguages
    .map((e) => e.supportedLanguage)
    .includes(newSL);

  if (sLNotIncluded) {
    const addSuppLanguage = WineryLanguage.create({
      wineryId,
      supportedLanguage: newSL,
    });
    await addSuppLanguage.save();
  }
}

async function addAmenititesIfMissing(newAmen: Amenity, wineryId: number) {
  // find all Supp Languages
  const currAmens: WineryAmenity[] = await WineryAmenity.find({
    where: { wineryId },
  });
  const amenNotIncluded = !currAmens.map((e) => e.amenity).includes(newAmen);
  if (amenNotIncluded) {
    const addAmen = WineryAmenity.create({
      wineryId,
      amenity: newAmen,
    });
    await addAmen.save();
  }
}

export const editWineryDb = async ({
  wineryId,
  description,
  productionType,
  wineType,
  supportedLanguages,
  amenities,
  yearlyWineProduction,
  foundationYear,
  googleMapsUrl,
  contactEmail,
  contactPhoneNumber,
  covidLabel,
}: EditWineryInputs): Promise<Winery> => {
  const qs = getConnection().createQueryBuilder().update(Winery);

  if (description) {
    await qs
      .set({ description: description })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (yearlyWineProduction) {
    await qs
      .set({ yearlyWineProduction: yearlyWineProduction })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (foundationYear) {
    await qs
      .set({ foundationYear: foundationYear })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (googleMapsUrl) {
    await qs
      .set({ googleMapsUrl: googleMapsUrl })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (contactEmail) {
    await qs
      .set({ contactEmail: contactEmail })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (contactPhoneNumber) {
    await qs
      .set({ contactPhoneNumber: contactPhoneNumber })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (covidLabel) {
    await qs
      .set({ covidLabel: covidLabel })
      .where("id = :wineryId", {
        wineryId,
      })
      .execute();
  }

  if (productionType) {
    for (let i = 0; i < productionType.length; i += 1) {
      const prodType = productionType[i] as ProductionType;
      await addProductionTypeIfMissing(prodType, wineryId);
    }
  }

  if (wineType) {
    for (let i = 0; i < wineType.length; i += 1) {
      const newWt = wineType[i] as TypeWine;
      await addWineTypeIfMissing(newWt, wineryId);
    }
  }

  if (supportedLanguages) {
    for (let i = 0; i < supportedLanguages.length; i += 1) {
      const newSL = supportedLanguages[i] as SupportedLanguage;
      await addSupportedLanguageIfMissing(newSL as SupportedLanguage, wineryId);
    }
  }

  if (amenities) {
    for (let i = 0; i < amenities.length; i += 1) {
      const newAmen = amenities[i] as Amenity;
      await addAmenititesIfMissing(newAmen as Amenity, wineryId);
    }
  }

  return await typeReturn<Winery>(
    qs
      .where("id = :wineryId", {
        wineryId,
      })
      .returning("*")
      .execute()
  );
};

export const updateWineryAccountCreationTime = async (
  wineryAlias: string,
  createdTime: number
): Promise<Winery> => {
  return await typeReturn<Winery>(
    getConnection()
      .createQueryBuilder()
      .update(Winery)
      .set({ accountCreatedTime: createdTime })
      .where("urlAlias = :wineryAlias", {
        wineryAlias,
      })
      .returning("*")
      .execute()
  );
};

export const findWineriesByValley = async (valley: Valley[]) => {
  return await getRepository(Winery)
    .createQueryBuilder("winery")
    .where('winery."valley" IN (:...valley)', { valley: valley })
    .getMany();
};
