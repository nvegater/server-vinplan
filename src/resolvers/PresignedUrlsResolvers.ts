import { Arg, Authorized, Int, Mutation, Resolver } from "type-graphql";
import { getPresignedUrl } from "../utils/s3Utilities";
import { GetPreSignedUrlResponse } from "./Outputs/presignedOutputs";
import { UploadType } from "./Inputs/presignedInputs";

@Resolver(GetPreSignedUrlResponse)
export class PresignedResolver {
  @Authorized("owner")
  @Mutation(() => GetPreSignedUrlResponse)
  async preSignedUrl(
    @Arg("fileNames", () => [String]) fileNames: string[],
    @Arg("uploadType", () => UploadType) uploadType: UploadType,
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("wineryAlias", () => String, { nullable: true }) wineryAlias: string,
    @Arg("creatorUsername", () => String, { nullable: true })
    creatorUsername: string
  ): Promise<GetPreSignedUrlResponse> {
    try {
      return await getPresignedUrl({
        fileNames,
        uploadType,
        wineryId,
        wineryAlias,
        creatorUsername,
      });
    } catch (error) {
      return error;
    }
  }
}
