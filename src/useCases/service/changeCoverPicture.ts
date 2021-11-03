import ServiceImageGalleryServices from "../../dataServices/serviceImageGallery";
import { ServiceCoverImageChangeResponse } from "../../resolvers/Service/serviceResolversOutputs";

const changeCoverPage = async (
  serviceId: number,
  serviceImageId: number
): Promise<ServiceCoverImageChangeResponse> => {
  try {
    // primero apagamos la imagen pasada
    const newCoverImage =
      await ServiceImageGalleryServices.unSelectCoverPageImage(serviceId);
    // // Despues intentamos cambiar la nueva imagen
    const changedImage = await ServiceImageGalleryServices.selectCoverPageImage(
      serviceImageId
    );
    if (changedImage.affected || changedImage.affected != 0) {
      return { changed: true };
    } else {
      // Si no se pudo se regresa la imagen pasada
      await ServiceImageGalleryServices.selectCoverPageImage(
        newCoverImage.raw[0].id
      );
      return {
        errors: [
          {
            field: "imageId",
            message: "La imagen no se puede borrar",
          },
        ],
        changed: false,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default changeCoverPage;
