"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const client_s3_1 = require("@aws-sdk/client-s3");
const log = (0, debug_1.default)('app:s3-service');
class S3Service {
    constructor() {
        this.S3 = new client_s3_1.S3({
            apiVersion: process.env.AWS_API_VERSION || '2006-03-01',
            region: process.env.AWS_REGION || 'eu-north-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }
    uploadPicture(fileName, file, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadParams = {
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
        });
    }
    deletePicture(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME || '',
                Key: fileName,
            };
            return new Promise((resolve, reject) => {
                try {
                    this.S3.deleteObject(deleteParams, (err, data) => {
                        if (err) {
                            log(`error deleting picture ${fileName} of S3: ${err}`);
                            reject(err);
                        }
                        else {
                            resolve(data);
                        }
                    });
                }
                catch (err) {
                    log(`error deleting picture ${fileName} of S3: ${err}`);
                }
            });
        });
    }
    pictureExists(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const headParams = {
                Bucket: process.env.AWS_BUCKET_NAME || '',
                Key: fileName,
            };
            return new Promise((resolve, reject) => {
                try {
                    this.S3.headObject(headParams, err => {
                        if (err && err.name === 'NotFound') {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                catch (err) {
                    log(`error getting picture ${fileName} of S3: ${err}`);
                    reject(err);
                }
            });
        });
    }
    getPicture(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const getParams = {
                Bucket: process.env.AWS_BUCKET_NAME || '',
                Key: key,
            };
            return new Promise((resolve, reject) => {
                try {
                    this.S3.getObject(getParams, (err, data) => {
                        if (err) {
                            log(`error getting picture ${key} of S3: ${err}`);
                            reject(err);
                        }
                        else {
                            resolve(data);
                        }
                    });
                }
                catch (err) {
                    log(`error getting picture ${key} of S3: ${err}`);
                    reject(err);
                }
            });
        });
    }
    getPictureURL(fileName) {
        const bucketName = process.env.AWS_BUCKET_NAME || '';
        const encodedFileName = encodeURIComponent(fileName);
        return `https://${bucketName}.s3.amazonaws.com/${encodedFileName}`;
    }
}
exports.default = new S3Service();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi9zZXJ2aWNlcy9zMy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBQzFCLGtEQU00QjtBQUU1QixNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUVyRCxNQUFNLFNBQVM7SUFHYjtRQUNFLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxjQUFFLENBQUM7WUFDZixVQUFVLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLElBQUksWUFBWTtZQUN2RCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksWUFBWTtZQUM5QyxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksRUFBRTtnQkFDaEQsZUFBZSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLElBQUksRUFBRTthQUN6RDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSyxhQUFhLENBQUMsUUFBZ0IsRUFBRSxJQUFZLEVBQUUsV0FBbUI7O1lBQ3JFLE1BQU0sWUFBWSxHQUEwQjtnQkFDMUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLEVBQUU7Z0JBQ3pDLEdBQUcsRUFBRSxRQUFRO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLFdBQVcsRUFBRSxXQUFXO2FBQ3pCLENBQUM7WUFFRixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUNyQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ25ELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxr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