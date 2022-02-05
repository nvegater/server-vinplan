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
    where: {
      creatorUsername: creatorUsername,
    },
  });
};

export const getWineryByAlias_DS = async (urlAlias: string) => {
  return await Winery.findOne({
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
  winery: CreateWineryInputs;
  user: UserInputs;
  stripeCustomerId: string;
}
type CreateWineryFn_DS = (props: CreateWineryProps_DS) => Promise<Winery>;
export const createWinery_DS: CreateWineryFn_DS = async ({
  winery,
  user,
  stripeCustomerId,
}) => {
  const wineryEntity = Winery.create({
    ...winery,
    stripe_customerId: stripeCustomerId,
    creatorUsername: user.username,
    creatorEmail: user.email,
    subscription: winery.subscription,
    wineType: [], // TODO: Nico make this fields optional
    productionType: [],
    supportedLanguages: [],
    amenities: [], // // TODO: Nico make this fields optional
  });
  await wineryEntity.save();

  const wineTypes = winery.wineType.map((wineType) => {
    return WineType.create({
      wineryId: wineryEntity.id,
      wineType: wineType,
    });
  });

  wineTypes.map(async (wineTypeEntity) => {
    await wineTypeEntity.save();
  });

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
    qs.set({ description });
  }

  if (yearlyWineProduction) {
    qs.set({ yearlyWineProduction: yearlyWineProduction });
  }

  if (foundationYear) {
    qs.set({ foundationYear: foundationYear });
  }

  if (googleMapsUrl) {
    qs.set({ googleMapsUrl: googleMapsUrl });
  }

  if (contactEmail) {
    qs.set({ contactEmail: contactEmail });
  }

  if (contactPhoneNumber) {
    qs.set({ contactPhoneNumber: contactPhoneNumber });
  }

  if (covidLabel) {
    qs.set({ covidLabel: covidLabel });
  }

  if (productionType) {
    for (const newPt in productionType) {
      await addProductionTypeIfMissing(newPt as ProductionType, wineryId);
    }
  }

  if (wineType) {
    for (const newWT in wineType) {
      await addWineTypeIfMissing(newWT as TypeWine, wineryId);
    }
  }

  if (supportedLanguages) {
    for (const newSL in supportedLanguages) {
      await addSupportedLanguageIfMissing(newSL as SupportedLanguage, wineryId);
    }
  }

  if (amenities) {
    for (const newAmen in amenities) {
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
