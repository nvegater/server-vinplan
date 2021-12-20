import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getPresignedUrl } from "../../utils/s3Utilities";
import { GetPreSignedUrlResponse } from "../Outputs/presignedOutputs";
import { PresignedUrlInput } from "../Inputs/presignedInputs";
import { FieldError } from "../Outputs/ErrorOutputs";
import { saveExperienceImageReferences } from "../../useCases/pictures/pictures";

@ObjectType()
export class ExperienceImageUpload {
  @Field()
  imageUrl: string;
  @Field()
  coverPage: boolean;
}
@ObjectType()
export class ExperienceImageResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => [ExperienceImageUpload])
  experienceImages?: ExperienceImageUpload[];
}

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

  @Mutation(() => ExperienceImageResponse)
  async experienceImagesUploaded(
    @Arg("experienceId", () => Int) experienceId: number,
    @Arg("preSignedUrls", () => [String]) preSignedUrls: string[]
  ): Promise<ExperienceImageResponse> {
    try {
      return await saveExperienceImageReferences(experienceId, preSignedUrls);
    } catch (error) {
      throw new Error(error);
    }
  }
}
