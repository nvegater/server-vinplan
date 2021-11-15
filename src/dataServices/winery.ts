import { Winery } from "../entities/Winery";
import CreateWineryInputs from "../resolvers/Inputs/CreateWineryInputs";
import { UserInputs } from "../resolvers/Inputs/UserInputs";

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

interface CreateWineryProps_DS {
  winery: CreateWineryInputs;
  user: UserInputs;
}
type CreateWineryFn_DS = (props: CreateWineryProps_DS) => Promise<Winery>;
export const createWinery_DS: CreateWineryFn_DS = async ({ winery, user }) => {
  const wineryEntity = Winery.create({
    ...winery,
    creatorUsername: user.username,
    creatorEmail: user.email,
    wineGrapesProduction: [],
    productionType: [],
    othersServices: [],
    wineType: [],
    supportedLanguages: [],
    amenities: [],
  });

  await wineryEntity.save();
  return wineryEntity;
};
