import AWS from "aws-sdk";
import mime from "mime";
import imagesNumberWineryGallery from "../useCases/pictures/countWineryImages";
import imagesNumberExperiencesGallery from "../useCases/pictures/countExperiencesImages";
import { PresignedUrlInput } from "../resolvers/Inputs/presignedInputs";
import {
  GetPreSignedUrlResponse,
  PresignedResponse,
} from "../resolvers/Outputs/presignedOutputs";

const spacesEndpoint = new AWS.Endpoint(
  process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT as string
);
const config: AWS.S3.Types.ClientConfiguration = {
  endpoint: spacesEndpoint as any,
  accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET,
};

const s3 = new AWS.S3(config);

const getElementsInAlbum = async (presignedUrl: PresignedUrlInput) => {
  if (presignedUrl.uploadType == "winerybook") {
    return await imagesNumberWineryGallery(presignedUrl.wineryId);
  } else if (presignedUrl.uploadType == "experiencealbum") {
    return await imagesNumberExperiencesGallery(presignedUrl.experienceId);
  }
  return 0;
};

export async function getPresignedUrl(presignedUrl: PresignedUrlInput) {
  try {
    const arrayUrl: PresignedResponse[] = [];
    let preSignedPutUrl, multimediaInfo, key, getUrl;
    const { fileNames } = presignedUrl;
    const expireSeconds = 60 * 5;
    const numElementsInAlbum = await getElementsInAlbum(presignedUrl);

    for (let i = 0; i < fileNames.length; i++) {
      multimediaInfo = await getMultimediaInfo(
        presignedUrl,
        fileNames[i],
        numElementsInAlbum + i
      );
      if (multimediaInfo.error) {
        break;
      }
      key = multimediaInfo.key;
      preSignedPutUrl = s3.getSignedUrl("putObject", {
        Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
        ContentType: multimediaInfo.contentType,
        ACL: "public-read",
        Expires: expireSeconds,
        Key: `${fileNames[i]}`,
      });
      getUrl = `${spacesEndpoint.protocol}//${process.env.NEXT_PUBLIC_DO_SPACES_NAME}.${spacesEndpoint.host}/${key}/${fileNames[i]}`;
      arrayUrl.push({ putUrl: preSignedPutUrl, getUrl: getUrl });
    }
    let response: GetPreSignedUrlResponse = {
      arrayUrl: arrayUrl,
    };
    if (multimediaInfo?.error) {
      response.errors = [
        {
          field: "maxElements",
          message: "Max elements in gallery",
        },
      ];
    }
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

const getMultimediaInfo = async (
  presignedUrl: PresignedUrlInput,
  fileName: string,
  numberOfElements: number
) => {
  try {
    const { uploadType, wineryId, creatorUsername, experienceId } =
      presignedUrl;
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
    const ext = fileName.split(".").pop() || "badFormat";
    let key = null;
    if (!imagesTypes.includes(ext.toLowerCase())) {
      throw new Error("Tipo de archivo incorrecto");
    }
    let prefix = "";
    let contentType = "";
    if (uploadType == "winerybook") {
      // Numero de elementos para poner la validacion
      if (numberOfElements > 9) {
        return { error: true };
      }
      prefix = `winery/${wineryId}-album`;
      contentType = mime.getType(ext) || "";
      key = `${prefix}`;
    }
    if (uploadType == "winerylogo") {
      prefix = `winery/${wineryId}-logo`;
      contentType = mime.getType(ext) || "";
      key = `${prefix}`;
    }
    if (uploadType == "userprofilepicture") {
      prefix = `user/${creatorUsername}-pictureProfile`;
      contentType = mime.getType(ext) || "";
      key = `${prefix}`;
    }
    if (uploadType == "experiencealbum") {
      if (numberOfElements > 9) {
        return { error: true };
      }
      prefix = `service/${experienceId}-album`;
      contentType = mime.getType(ext) || "";
      key = `${prefix}`;
    }
    return {
      prefix: prefix,
      contentType: contentType,
      key: key,
    };
  } catch (error) {
    throw new Error(error);
  }
};

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

export async function s3UploadFile(
  file: any,
  fileName: string,
  contentType: string
) {
  try {
    const params = {
      Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}`,
      Key: fileName,
      Body: file,
      ACL: "public-read",
      ContentType: contentType,
    };
    await s3UploadWrapper(params, params.Key);
    return `${spacesEndpoint.protocol}//${process.env.NEXT_PUBLIC_DO_SPACES_NAME}.${spacesEndpoint.host}/${fileName}`;
  } catch (error) {
    throw new Error(error);
  }
}

const s3UploadWrapper = (params: any, keyName: string) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) {
        reject({ err: err, key: keyName });
      } else {
        resolve({ data: data, key: keyName });
      }
    });
  });
};
