import { Arg, Query, Resolver } from "type-graphql";
import { getPresignedUrl } from "../../utils/s3Utilities";
import { GetPreSignedUrlResponse } from "../Outputs/presignedOutputs";
import { PresignedUrlInput } from "../Inputs/presignedInputs";

@Resolver(GetPreSignedUrlResponse)
export class PresignedResolver {
  @Query(() => GetPreSignedUrlResponse)
  async preSignedUrl(
    @Arg("presignedUrlInputs") presignedUrlInputs: PresignedUrlInput
  ): Promise<GetPreSignedUrlResponse> {
    try {
      return await getPresignedUrl({ ...presignedUrlInputs });
    } catch (error) {
      return error;
    }
  }
}
