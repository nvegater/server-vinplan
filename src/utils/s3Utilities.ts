import AWS from 'aws-sdk';
import mime from 'mime';
import {PresignedUrlInput} from "../resolvers/PreSignedUrl/presignedInputs"
import { PresignedResponse } from "../resolvers/PreSignedUrl/presignedOutputs"
import imagesNumberGallery from "../useCases/winery/countWineryImages"

const spacesEndpoint = new AWS.Endpoint(process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT as string);
const config: AWS.S3.Types.ClientConfiguration = {
    endpoint: spacesEndpoint as any,
    accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET
}

const s3 = new AWS.S3(config);

export async function getPresignedUrl(presignedUrl: PresignedUrlInput) {
    try {
        const arrayUrl : PresignedResponse[] = []
        let preSignedPutUrl, multimediaInfo, key, getUrl;
        const {fileName} = presignedUrl
        const expireSeconds = 60 * 5
        
        await fileName.forEach(async (element) => {
            multimediaInfo = await getMultimediaInfo(presignedUrl, element);
            key = multimediaInfo.key;
            preSignedPutUrl = await s3.getSignedUrl('putObject',{
                Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
                ContentType: multimediaInfo.contentType,
                ACL: 'public-read', 
                Expires: expireSeconds,
                Key: `${element}`,
            });
            getUrl = `${spacesEndpoint.protocol}//${process.env.NEXT_PUBLIC_DO_SPACES_NAME}.${spacesEndpoint.host}/${key}/${element}`;
            arrayUrl.push({putUrl : preSignedPutUrl, getUrl : getUrl});
        });
        return {
            arrayUrl : arrayUrl
        };
    } catch (error) {
        throw new Error(error)
    }
}

const getMultimediaInfo = async (presignedUrl: PresignedUrlInput, fileName : string) => {
    try {
        const {uploadType, wineryId, userId, serviceId} = presignedUrl
        const imagesTypes = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp' ];
        const ext = fileName.split('.').pop() || 'badFormat';
        let key = null
        if (!imagesTypes.includes(ext.toLowerCase())) {
            throw new Error('Tipo de archivo incorrecto');
        }
        let prefix = '';
        let contentType = '';
        if (uploadType == 'winerybook') {
            // Numero de elementos para poner la validacion
            if (await imagesNumberGallery(wineryId) > 10) {
                throw new Error('Numero maximo de imagenes');
            }
                prefix = `winery/${wineryId}-album`;
                contentType = mime.getType(ext) || '';
                key = `${prefix}`
        }
        if (uploadType == 'userprofilepicture'){
            prefix = `user/${userId}-pictureProfile`;
            contentType = mime.getType(ext) || '';
            key = `${prefix}`
        }
        if (uploadType == 'servicealbum'){
            prefix = `service/${serviceId}-album`;
            contentType = mime.getType(ext) || '';
            key = `${prefix}`
        }
        return {
            prefix: prefix,
            contentType: contentType,
            key: key,
        }
    } catch (error) {
        throw new Error(error)
    }
}

export async function deleteImageFromS3(url: string) {
    try {
        const myURL = new URL(url);
        const params = {  Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}`, Key: myURL.pathname };
        await s3.deleteObject(params).promise();
    } catch (error) {
        throw new Error(error)
    }
}