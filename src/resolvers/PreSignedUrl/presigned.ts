import {Arg, Query, Resolver, Int } from "type-graphql"
import {getPresignedUrl} from "../../utils/s3Utilities"
import {WineryGetPreSignedUrlResponse} from "./presignedOutputs";
import {PresignedUrlInput, UploadType} from "./presignedInputs"

@Resolver(WineryGetPreSignedUrlResponse)
export class PresignedResolver {

    @Query(() => WineryGetPreSignedUrlResponse)
    async preSignedUrl(
        @Arg('fileName') fileName : string,
        @Arg('uploadType', () => UploadType ) uploadType : UploadType,
        @Arg('wineryId', () => Int, {nullable: true}) wineryId: number,
        @Arg('userId', () => Int, {nullable: true}) userId: number,
    ): Promise<WineryGetPreSignedUrlResponse> {
        try {
            const presignedUrlInput = new PresignedUrlInput();
            presignedUrlInput.fileName = fileName;
            presignedUrlInput.uploadType = uploadType;
            presignedUrlInput.wineryId = wineryId;
            presignedUrlInput.userId = userId;

            return await getPresignedUrl(presignedUrlInput);
        } catch (error) {
            return error
        }
    }

}