import {Arg, Query, Int, Resolver } from "type-graphql"
import {getPresignedUrl} from "../../utils/s3Utilities"
import {WineryGetPreSignedUrlResponse} from "./presignedOutputs";

@Resolver(WineryGetPreSignedUrlResponse)
export class PresignedResolver {

    @Query(() => WineryGetPreSignedUrlResponse)
    async preSignedUrl(
        @Arg('fileName', () => String) fileName : string,
        @Arg('wineryId', () => Int) wineryId : number,
        @Arg('userId', () => Int) userId : number,
        //¿como puedo armar un enum sin tener que levantar una nueva tabla?
        @Arg('uploadType', () => String) uploadType: string,
    ): Promise<WineryGetPreSignedUrlResponse> {
        try {
            const presigned = await getPresignedUrl(fileName, wineryId, userId, uploadType) 
            return presigned;
        } catch (error) {
            return error
        }
    }

}