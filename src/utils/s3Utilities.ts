import AWS from 'aws-sdk';
import mime from 'mime';
import {WINERYALBUM} from '../constants'

const spacesEndpoint = new AWS.Endpoint(process.env.NEXT_PUBLIC_DO_SPACES_ENDPOINT as string);
const config: AWS.S3.Types.ClientConfiguration = {
    endpoint: spacesEndpoint as any,
    accessKeyId: process.env.NEXT_PUBLIC_DO_SPACES_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_DO_SPACES_SECRET
}

const s3 = new AWS.S3(config);

export async function getPresignedUrl(fileName:string, wineryId:number, origin: string) {
    try {
        const multimediaInfo = getMultimediaInfo(fileName, wineryId, origin);
        const key = `${multimediaInfo.prefix}/${Date.now()}`
        const expireSeconds = 60 * 5

        const preSignedPutUrl = await s3.getSignedUrl('putObject',{
            Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
            ContentType: multimediaInfo.contentType,
            Expires: expireSeconds,
            Key: fileName,
        })
        const preSignedGetUrl = s3.getSignedUrl('getObject', {
            Bucket: `${process.env.NEXT_PUBLIC_DO_SPACES_NAME}/${key}`,
            Expires: expireSeconds,
            Key: fileName,
        });
        return {
            putUrl: preSignedPutUrl,
            getUrl: preSignedGetUrl,
        };
    } catch (error) {
        throw new Error(error)
    }
}

const getMultimediaInfo = (fileName: string, wineryId: number, origin: string) => {
    try {
        const imagesTypes = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp' ];
        const ext = fileName.split('.').pop() || 'badFormat';
        if (!imagesTypes.includes(ext.toLowerCase())) {
            throw new Error('Tipo de archivo incorrecto');
        }
        let prefix = '';
        let contentType = '';
        if (origin == WINERYALBUM) {
            prefix = `winery/${wineryId}-album`;
            contentType = mime.getType(ext) || '';
        }
        return {
            prefix: prefix,
            contentType: contentType,
        }
    } catch (error) {
        throw new Error(error)
    }
}