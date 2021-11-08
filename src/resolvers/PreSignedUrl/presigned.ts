import { Arg, Query, Resolver, Int } from "type-graphql";
import { getPresignedUrl } from "../../utils/s3Utilities";
import { GetPreSignedUrlResponse } from "./presignedOutputs";
import { PresignedUrlInput, UploadType } from "./presignedInputs";

@Resolver(GetPreSignedUrlResponse)
export class PresignedResolver {
  @Query(() => GetPreSignedUrlResponse)
  async preSignedUrl(
    @Arg("fileName", () => [String]) fileName: string[],
    @Arg("uploadType", () => UploadType) uploadType: UploadType,
    @Arg("wineryId", () => Int, { nullable: true }) wineryId: number,
    @Arg("serviceId", () => Int, { nullable: true }) serviceId: number,
    @Arg("userId", () => Int, { nullable: true }) userId: number
  ): Promise<GetPreSignedUrlResponse> {
    try {
      const presignedUrlInput = new PresignedUrlInput();
      presignedUrlInput.fileName = fileName;
      presignedUrlInput.uploadType = uploadType;
      presignedUrlInput.wineryId = wineryId;
      presignedUrlInput.serviceId = serviceId;
      presignedUrlInput.userId = userId;
      return await getPresignedUrl(presignedUrlInput);
    } catch (error) {
      return error;
    }
  }
}
