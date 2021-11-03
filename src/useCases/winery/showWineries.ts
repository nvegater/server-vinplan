import { Winery } from "../../entities/Winery";
import { WineType } from "../../entities/WineType";
import { WineProductionType } from "../../entities/WineProductionType";
import { getConnection, In } from "typeorm";
import wineryErrors from "../../resolvers/Winery/wineryResolversErrors";
import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";
import { WineryImageGallery } from "../../entities/WineryImageGallery";
import { WineriesResponse } from "../../resolvers/Winery/wineryResolversOutputs";
import { SQL_QUERY_SELECT_WINERIES } from "../../resolvers/Universal/queries";

const showWineries = async (limit: number): Promise<WineriesResponse> => {
  try {
    const realLimit = Math.min(50, limit);
    const replacements = [realLimit + 1];
    const paginatedWineriesDB: any = await getConnection().query(
      SQL_QUERY_SELECT_WINERIES,
      replacements
    );
    if (paginatedWineriesDB !== undefined) {
      const wineriesIds: number[] = paginatedWineriesDB.map(
        (winery: any) => winery.id
      );
      const wineTypesOfWinery: WineType[] | undefined = await WineType.find({
        where: { wineryId: In(wineriesIds) },
      });
      const prodTypesOfWinery: WineProductionType[] | undefined =
        await WineProductionType.find({
          where: { wineryId: In(wineriesIds) },
        });
      const pagWinsWExtraProps: Winery[] = paginatedWineriesDB.map(
        async (winery: Winery) => {
          const wineryImages: WineryImageGallery[] | [] =
            await WineryImageGalleryServices.getWineryGalleryById(winery.id);
          winery.urlImageCover =
            wineryImages.find(
              (wineryImage: WineryImageGallery) => wineryImage.coverPage
            )?.imageUrl ||
            "https://dev-vinplan.fra1.digitaloceanspaces.com/winery/1-album/1619825058524/grapes.jpg";
          // TODO remove hardcoded address, use env variables instead
          return {
            ...winery,
            productionType: prodTypesOfWinery
              .filter((wineType) => wineType.wineryId === winery.id)
              .map((prod) => prod.productionType),
            wineType: wineTypesOfWinery
              .filter((wineType) => wineType.wineryId === winery.id)
              .map((wt) => wt.wineType),
          };
        }
      );
      return {
        paginatedWineries: pagWinsWExtraProps.slice(0, realLimit),
        moreWineriesAvailable: pagWinsWExtraProps.length === realLimit + 1, // DB has more posts than requested
      };
    } else {
      return {
        errors: [wineryErrors.wineryNotFound],
        moreWineriesAvailable: false,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default showWineries;
