import WineryImageGalleryServices from "../../dataServices/wineryImageGallery";
import { WineryChangeResponse } from "../../resolvers/Winery/wineryResolversOutputs";
import wineryResolverErrors from "../../resolvers/Winery/wineryResolversErrors";

const changeCoverPage = async (
  wineryId: number,
  wineryImageId: number
): Promise<WineryChangeResponse> => {
  try {
    // primero apagamos la imagen pasada
    const newCoverImage =
      await WineryImageGalleryServices.unSelectCoverPageImage(wineryId);
    // // Despues intentamos cambiar la nueva imagen
    const changedImage = await WineryImageGalleryServices.selectCoverPageImage(
      wineryImageId
    );
    if (changedImage.affected || changedImage.affected != 0) {
      return { changed: true };
    } else {
      // Si no se pudo se regresa la imagen pasada
      await WineryImageGalleryServices.selectCoverPageImage(
        newCoverImage.raw[0].id
      );
      return { errors: [wineryResolverErrors.imageNotFound], changed: false };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default changeCoverPage;
