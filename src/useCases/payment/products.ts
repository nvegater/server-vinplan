import { getProductIds_DS } from "../../dataServices/payment";
import { ProductsResponse } from "../../resolvers/Outputs/ProductOutputs";

export const getProductIds = async (): Promise<ProductsResponse> => {
  const stripe_productsIds = await getProductIds_DS();
  return {
    productIds: stripe_productsIds,
  };
};
