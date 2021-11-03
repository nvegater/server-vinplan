import dataServices from "../../dataServices/service";
import { UpdateServiceInputs } from "../../resolvers/Service/serviceResolversInputs";
import { UpdateServiceResponse } from "../../resolvers/Service/serviceResolversOutputs";
import { FieldError } from "../../resolvers/User/userResolversOutputs";

const updateService = async (
  updateServiceInputs: UpdateServiceInputs,
  userId: number
): Promise<UpdateServiceResponse> => {
  try {
    const service = await dataServices.updateService(
      updateServiceInputs,
      userId
    );
    if (service === null) {
      const error: FieldError = {
        field: "updateService",
        message: "no change was made",
      };
      return { errors: [error] };
    } else {
      return { service };
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default updateService;
