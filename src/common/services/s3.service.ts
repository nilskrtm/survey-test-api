import debug from 'debug';
import {
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  HeadObjectCommandInput,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';

const log: debug.IDebugger = debug('app:s3-service');

class S3Service {
  S3: S3;

  constructor() {
    this.S3 = new S3({
      apiVersion: process.env.AWS_API_VERSION || '2006-03-01',
      region: process.env.AWS_REGION || 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  public async uploadPicture(
    fileName: string,
    file: Buffer,
    contentType: string,
  ): Promise<PutObjectCommandOutput | unknown | undefined> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: fileName,
      Body: file,
      ContentType: contentType,
    };

    return new Promise((resolve, reject) => {
      this.S3.putObject(uploadParams, (err, data) => {
        if (err) {
          log(`error uploading picture to S3: ${err}`);

          reject(err);
        }
        if (data) {
          resolve(data);
        }
      });
    });
  }

  public async deletePicture(
    fileName: string,
  ): Promise<DeleteObjectCommandOutput | unknown | undefined> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: fileName,
    };

    return new Promise((resolve, reject) => {
      try {
        this.S3.deleteObject(deleteParams, (err, data) => {
          if (err) {
            log(`error deleting picture ${fileName} of S3: ${err}`);

            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        log(`error deleting picture ${fileName} of S3: ${err}`);
      }
    });
  }

  public async pictureExists(fileName: string): Promise<boolean | unknown> {
    const headParams: HeadObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: fileName,
    };

    return new Promise((resolve, reject) => {
      try {
        this.S3.headObject(headParams, err => {
          if (err && err.name === 'NotFound') {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      } catch (err) {
        log(`error getting picture ${fileName} of S3: ${err}`);

        reject(err);
      }
    });
  }

  public async getPicture(
    key: string,
  ): Promise<GetObjectCommandOutput | unknown | undefined> {
    const getParams: GetObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: key,
    };

    return new Promise((resolve, reject) => {
      try {
        this.S3.getObject(getParams, (err, data) => {
          if (err) {
            log(`error getting picture ${key} of S3: ${err}`);

            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        log(`error getting picture ${key} of S3: ${err}`);

        reject(err);
      }
    });
  }

  public getPictureURL(fileName: string) {
    const bucketName = process.env.AWS_BUCKET_NAME || '';
    const encodedFileName = encodeURIComponent(fileName);

    return `https://${bucketName}.s3.amazonaws.com/${encodedFileName}`;
  }
}

export default new S3Service();
