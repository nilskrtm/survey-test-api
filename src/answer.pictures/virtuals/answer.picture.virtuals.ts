import { HydratedDocument, SchemaOptionsVirtualsPropertyType } from 'mongoose';
import {
  AnswerPicture,
  AnswerPictureVirtualFields,
} from '../daos/answer.pictures.dao';
import { IAnswerPictureQueryHelpers } from '../query/answer.pictures.query.helpers';
import S3Service from '../../common/services/s3.service';
interface IAnswerPictureVirtuals
  extends SchemaOptionsVirtualsPropertyType<
    HydratedDocument<AnswerPicture>,
    AnswerPictureVirtualFields,
    IAnswerPictureQueryHelpers
  > {}

const AnswerPictureVirtuals: IAnswerPictureVirtuals = {
  _url: {
    get(this: AnswerPicture) {
      return S3Service.getPictureURL(this.fileName);
    },
  },
};

export default AnswerPictureVirtuals;
