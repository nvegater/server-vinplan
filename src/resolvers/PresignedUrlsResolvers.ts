import { Arg, Authorized, Int, Mutation, Resolver } from "type-graphql";
import { getPresignedUrl } from "../dataServices/s3Utilities";
import {
  GetPreSignedUrlResponse,
  InsertImageResponse,
} from "./Outputs/presignedOutputs";
import { UploadType } from "./Inputs/presignedInputs";
import {
  getWineryImages,
  saveWineryImage,
} from "../useCases/pictures/pictures";

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

  @Authorized("owner")
  @Mutation(() => InsertImageResponse)
  async saveImages(
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("imageKeys", () => [String]) imageKeys: string[]
  ): Promise<InsertImageResponse> {
    return await saveWineryImage(wineryId, imageKeys);
  }

  @Authorized("owner")
  @Mutation(() => InsertImageResponse)
  async wineryImages(
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("wineryAlias", () => String, { nullable: true }) wineryAlias: string
  ): Promise<InsertImageResponse> {
    return await getWineryImages(wineryId, wineryAlias);
  }
}
