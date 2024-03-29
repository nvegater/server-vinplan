import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {getPresignedUrl} from "../dataServices/s3Utilities";
import {GetPreSignedUrlResponse, ImageGalleryResponse, InsertImageResponse,} from "./Outputs/presignedOutputs";
import {UploadType} from "./Inputs/presignedInputs";
import {addWineryImageToExperience, getWineryImages, saveWineryImage,} from "../useCases/pictures/pictures";

@Resolver(GetPreSignedUrlResponse)
export class PresignedResolver {
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

  @Mutation(() => InsertImageResponse)
  async saveImages(
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("wineryAlias", () => String, { nullable: true }) wineryAlias: string,
    @Arg("imageNames", () => [String]) imageNames: string[]
  ): Promise<InsertImageResponse> {
    return await saveWineryImage(wineryId, wineryAlias, imageNames);
  }

  @Query(() => ImageGalleryResponse)
  async wineryImages(
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("wineryAlias", () => String, { nullable: true }) wineryAlias: string
  ): Promise<ImageGalleryResponse> {
    return await getWineryImages(wineryId, wineryAlias);
  }

  @Mutation(() => InsertImageResponse)
  async addImageToExperience(
    @Arg("wineryImageId", () => Int, { nullable: true }) wineryImageId: number,
    @Arg("experienceId", () => Int, { nullable: true }) experienceId: number
  ): Promise<InsertImageResponse> {
    return await addWineryImageToExperience(wineryImageId, experienceId);
  }
}
