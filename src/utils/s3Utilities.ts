import AWS from 'aws-sdk';
import mime from 'mime';
import {PresignedUrlInput} from "../resolvers/PreSignedUrl/presignedInputs"

const spacesEndpoint = new AWS.Endpoint(process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT as string);
const config: AWS.S3.Types.ClientConfiguration = {
    endpoint: spacesEndpoint as any,
    accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET
}

const s3 = new AWS.S3(config);

export async function getPresignedUrl(presignedUrl: PresignedUrlInput) {
    try {
        const {fileName} = presignedUrl
        const multimediaInfo = getMultimediaInfo(presignedUrl);
        const key = multimediaInfo.key;
        const expireSeconds = 60 * 5

        const preSignedPutUrl = await s3.getSignedUrl('putObject',{
            Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
            ContentType: multimediaInfo.contentType,
            ACL: 'public-read', 
            Expires: expireSeconds,
            Key: fileName,
        });
        const getUrl = `${spacesEndpoint.protocol}//${process.env.NEXT_PUBLIC_DO_SPACES_NAME}.${spacesEndpoint.host}/${key}/${fileName}`;
        // const preSignedGetUrl = s3.getSignedUrl('getObject', {
        //     Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
        //     Expires: expireSeconds,
        //     Key: fileName,
        // });
        return {
            putUrl: preSignedPutUrl,
            getUrl: getUrl,
        };
    } catch (error) {
        throw new Error(error)
    }
}

const getMultimediaInfo = (presignedUrl: PresignedUrlInput) => {
    try {
        const {fileName, uploadType, wineryId, userId} = presignedUrl
        const imagesTypes = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp' ];
        const ext = fileName.split('.').pop() || 'badFormat';
        let key = null
        if (!imagesTypes.includes(ext.toLowerCase())) {
            throw new Error('Tipo de archivo incorrecto');
        }
        let prefix = '';
        let contentType = '';
        if (uploadType == 'winerybook') {
            prefix = `winery/${wineryId}-album`;
            contentType = mime.getType(ext) || '';
            key = `${prefix}/${Date.now()}`
        }
        if (uploadType == 'userprofilepicture'){
            prefix = `user/${userId}-pictureProfile`;
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