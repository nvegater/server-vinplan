import {Arg, Query, Resolver } from "type-graphql"
import {getPresignedUrl} from "../../utils/s3Utilities"
import {WineryGetPreSignedUrlResponse} from "./presignedOutputs";
import {PresignedUrlInput} from "./presignedInputs"

@Resolver(WineryGetPreSignedUrlResponse)
export class PresignedResolver {

    @Query(() => WineryGetPreSignedUrlResponse)
    async preSignedUrl(
        @Arg('preSignedData') PresignedUrlInput : PresignedUrlInput,
    ): Promise<WineryGetPreSignedUrlResponse> {
        try {
            return await getPresignedUrl(PresignedUrlInput);
        } catch (error) {
            return error
        }
    }

}