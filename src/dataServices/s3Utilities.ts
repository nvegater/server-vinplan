import AWS from "aws-sdk";
import mime from "mime";
import {
  PresignedUrlInput,
  UploadType,
} from "../resolvers/Inputs/presignedInputs";
import {
  GetPreSignedUrlResponse,
  PresignedResponse,
} from "../resolvers/Outputs/presignedOutputs";
import { customError, FieldError } from "../resolvers/Outputs/ErrorOutputs";
import { countWineryImagesByWineryId } from "./pictures";

const imagesTypes = [
  "apng",
  "avif",
  "gif",
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "svg",
  "webp",
];

const spacesEndpoint = new AWS.Endpoint(
  process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT as string
);
const config: AWS.S3.Types.ClientConfiguration = {
  endpoint: spacesEndpoint as any,
  accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET,
};

const s3 = new AWS.S3(config);

type MediaDetails = {
  contentType?: string;
  prefix?: string;
  errors?: FieldError[];
};
const getMultimediaInfo = (
  presignedUrl: PresignedUrlInput,
  fileName: string,
  numberOfElements: number
): MediaDetails => {
  const { uploadType, wineryAlias, creatorUsername } = presignedUrl;

  const ext = fileName.split(".").pop() || "badFormat";

  if (!imagesTypes.includes(ext.toLowerCase())) {
    return customError("badFileType", "The file type is wrong");
  }
  if (numberOfElements > 9) {
    return customError("maxElements", "Max elements in gallery");
  }
  let prefix = "";
  let contentType = "";
  switch (uploadType) {
    case UploadType.WINERY_PIC:
      prefix = `wineries/${wineryAlias}`;
      contentType = mime.getType(ext) || "";
      break;
    case UploadType.WINERY_LOGO:
      prefix = `wineries/${wineryAlias}/logo`;
      contentType = mime.getType(ext) || "";
      break;
    case UploadType.USER_PIC:
      prefix = `users/${creatorUsername}/profile`;
      contentType = mime.getType(ext) || "";
      break;
    default:
      return customError("uploadType", "Upload type not supported");
  }
  return {
    contentType: contentType,
    prefix: prefix,
  };
};

const expireSeconds = 60 * 5; // 5 mins to upload the image before links expires
export async function getPresignedUrl(
  presignedUrlInputs: PresignedUrlInput
): Promise<GetPreSignedUrlResponse> {
  try {
    const { fileNames, wineryId } = presignedUrlInputs;
    const numElementsInAlbum = await countWineryImagesByWineryId(wineryId);

    const presignedResponses: PresignedResponse[] = await Promise.all(
      fileNames.map(async (fileName, index) => {
        const mediaDetails: MediaDetails = getMultimediaInfo(
          presignedUrlInputs,
          fileName,
          numElementsInAlbum + index
        );
        const errors = mediaDetails.errors;
        if (errors) {
          return customError(errors[index].field, errors[index].message);
        }
        const prefix: string = mediaDetails?.prefix as string;
        const contentType: string = mediaDetails?.contentType as string;
        const signedUrlsParams = {
          // We have 3 Keys:
          // 1. Wineries/alias/name 2. Wineries/alias/logo/name 2. Users/username/profile
          Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${prefix}`,
          Key: `${fileName}`,
          ContentType: contentType,
          ACL: "public-read",
          Expires: expireSeconds,
        };
        const preSignedPutUrl = s3.getSignedUrl("putObject", signedUrlsParams);
        const preSignedGetUrl = s3.getSignedUrl("getObject", {
          Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${prefix}`,
          Key: `${fileName}`,
        });
        //const getUrl = `${spacesEndpoint.protocol}//${process.env.NEXT_PUBLIC_DO_SPACES_NAME}.${spacesEndpoint.host}/${prefix}/${fileName}`;
        return {
          putUrl: preSignedPutUrl,
          getUrl: preSignedGetUrl,
          imageName: fileName,
        };
      })
    );
    return { arrayUrl: presignedResponses };
  } catch (error) {
    throw new Error(error);
  }
}

const getExpireSeconds = 60 * 10; // 10 mins to download the image before links expires

export function getWineryImageGetURL(
  imageName: string,
  wineryAlias: string
): string {
  const prefix = `wineries/${wineryAlias}`;
  return s3.getSignedUrl("getObject", {
    Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${prefix}`,
    Key: `${imageName}`,
    Expires: getExpireSeconds,
  });
}

export async function deleteImageFromS3(url: string) {
  try {
    console.log(url);
    const myURL = new URL(url);
    const params = {
      Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}`,
      Key: myURL.pathname,
    };
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
