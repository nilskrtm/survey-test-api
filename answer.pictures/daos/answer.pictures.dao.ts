import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { DAO } from '../../common/classes/dao.class';
import { CreateAnswerPictureDTO } from '../dto/create.answer.picture.dto';
import { PatchAnswerPictureDTO } from '../dto/patch.answer.picture.dto';
import { PutAnswerPictureDTO } from '../dto/put.answer.picture.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import {
  PagingParams,
  RequestPagingParams,
} from '../../common/types/paging.params.type';

const log: debug.IDebugger = debug('app:answer-pictures-dao');

export type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: {};
  created: Date;
  edited: Date;
};

const defaultAnswerPictureValues: Partial<AnswerPicture> = {
  name: 'Name noch nicht festgelegt',
  fileName: '',
  created: new Date(),
  edited: new Date(),
};

class AnswerPicturesDAO extends DAO<AnswerPicture> {
  AnswerPictureSchema: Schema<AnswerPicture>;
  AnswerPictureModel: Model<AnswerPicture>;

  constructor() {
    super();

    this.AnswerPictureSchema = new Schema<AnswerPicture>(
      {
        _id: String,
        name: String,
        fileName: String,
        owner: { type: String, ref: 'User' },
        created: Date,
        edited: Date,
      },
      { id: false, collection: 'answer_pictures', versionKey: false },
    );

    this.AnswerPictureModel = mongooseService
      .getMongoose()
      .model<AnswerPicture>('AnswerPicture', this.AnswerPictureSchema);

    log('Created new instance of AnswerPicturesDao');
  }

  getModel(): Model<AnswerPicture> {
    return this.AnswerPictureModel;
  }

  async addAnswerPicture(answerPictureFields: CreateAnswerPictureDTO) {
    const answerPictureId = uuid();
    const answerPicture = new this.AnswerPictureModel({
      _id: answerPictureId,
      ...defaultAnswerPictureValues,
      ...answerPictureFields,
    });

    await answerPicture.save();

    return answerPictureId;
  }

  async getAnswerPictureById(answerPictureId: string) {
    return await this.AnswerPictureModel.findOne({
      _id: answerPictureId,
    }).exec();
  }

  async getAnswerPictures(paging: RequestPagingParams) {
    const count = (await this.AnswerPictureModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const answerPictures = await this.AnswerPictureModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .exec();

    delete pagingParams.offset;

    return {
      answerPictures: answerPictures,
      paging: pagingParams,
    };
  }

  async getAnswerPicturesOfUser(paging: RequestPagingParams, userId: string) {
    const count = (await this.AnswerPictureModel.find({ owner: userId }).exec())
      .length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const answerPictures = await this.AnswerPictureModel.find({ owner: userId })
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .exec();

    delete pagingParams.offset;

    return {
      answerPictures: answerPictures,
      paging: pagingParams,
    };
  }

  async getAnswerPictureCountOfUser(userId: string) {
    return (await this.AnswerPictureModel.find({ owner: userId }).exec())
      .length;
  }

  async updateAnswerPictureById(
    answerPictureId: string,
    answerPictureFields: PatchAnswerPictureDTO | PutAnswerPictureDTO,
  ) {
    return await this.AnswerPictureModel.findOneAndUpdate(
      { _id: answerPictureId },
      { $set: answerPictureFields },
      { new: true },
    ).exec();
  }

  async removeAnswerPictureById(answerPictureId: string) {
    return await this.AnswerPictureModel.findOneAndRemove({
      _id: answerPictureId,
    }).exec();
  }
}

export default new AnswerPicturesDAO();
