import { Authorized, Mutation, Resolver } from "type-graphql";
import { ProductsResponse } from "../Outputs/ProductOutputs";
import { getProductIds } from "../../useCases/payment/products";

@Resolver()
export class ProductResolvers {
  @Authorized()
  @Mutation(() => ProductsResponse)
  async getProductIds(): Promise<ProductsResponse> {
    return await getProductIds();
  }
}
