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
import { RequestOptions } from '../../common/interfaces/request.options.interface';
import AnswerPictureQueryHelpers, {
  IAnswerPictureQueryHelpers,
} from '../query/answer.pictures.query.helpers';

const log: debug.IDebugger = debug('app:answer-pictures-dao');

export type AnswerPicture = {
  _id: string;
  name: string;
  fileName: string;
  owner: string;
  created: Date;
  edited: Date;
};

const defaultAnswerPictureValues: () => Partial<AnswerPicture> = () => {
  return {
    name: 'Name noch nicht festgelegt',
    fileName: '',
    created: new Date(),
    edited: new Date(),
  };
};

type AnswerPictureModelType = Model<AnswerPicture, IAnswerPictureQueryHelpers>;

class AnswerPicturesDAO extends DAO<AnswerPicture> {
  AnswerPictureSchema: Schema<
    AnswerPicture,
    AnswerPictureModelType,
    IAnswerPictureQueryHelpers,
    {},
    IAnswerPictureQueryHelpers
  >;
  AnswerPictureModel: AnswerPictureModelType;

  constructor() {
    super();

    this.AnswerPictureSchema = new Schema<
      AnswerPicture,
      AnswerPictureModelType,
      IAnswerPictureQueryHelpers,
      {},
      IAnswerPictureQueryHelpers
    >(
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

    this.AnswerPictureSchema.query = AnswerPictureQueryHelpers;

    this.AnswerPictureModel = mongooseService
      .getMongoose()
      .model<AnswerPicture, AnswerPictureModelType>(
        'AnswerPicture',
        this.AnswerPictureSchema,
      );

    log('Created new instance of AnswerPicturesDAO');
  }

  getModel(): Model<AnswerPicture> {
    return this.AnswerPictureModel;
  }

  async addAnswerPicture(answerPictureFields: CreateAnswerPictureDTO) {
    const answerPictureId = uuid();
    const answerPicture = new this.AnswerPictureModel({
      _id: answerPictureId,
      ...defaultAnswerPictureValues(),
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

  async getAnswerPicturesOfUser(options: RequestOptions, userId: string) {
    const unusedAnswerPictureIds: Array<string> =
      'used' in options.filtering
        ? await this.getUnusedAnswerPicturesOfUser(userId)
        : [];

    const count = (
      await this.AnswerPictureModel.find({ owner: userId })
        .applyFiltering({
          ...options.filtering,
          unusedAnswerPictureIds: unusedAnswerPictureIds,
        })
        .exec()
    ).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      options.paging,
      count,
    );

    const answerPictures = await this.AnswerPictureModel.find({ owner: userId })
      .applyFiltering({
        ...options.filtering,
        unusedAnswerPictureIds: unusedAnswerPictureIds,
      })
      .applySorting(options.sorting)
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

  async getUnusedAnswerPicturesOfUser(userId: string) {
    return (
      await this.AnswerPictureModel.aggregate<{ _id: string }>([
        {
          $match: {
            owner: userId,
          },
        },
        {
          $lookup: {
            from: 'answer_options',
            localField: '_id',
            foreignField: 'picture',
            as: 'answerOptions',
          },
        },
        {
          $lookup: {
            from: 'questions',
            localField: 'answerOptions._id',
            foreignField: 'answerOptions',
            as: 'questions',
          },
        },
        {
          $lookup: {
            from: 'surveys',
            localField: 'questions._id',
            foreignField: 'questions',
            as: 'surveys',
          },
        },
        {
          $match: {
            $expr: {
              $eq: [
                0,
                {
                  $size: '$surveys',
                },
              ],
            },
          },
        },
        {
          $project: {
            _id: '$_id',
          },
        },
      ]).exec()
    ).map(answerPicture => answerPicture._id);
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
    return await this.AnswerPictureModel.deleteOne({
      _id: answerPictureId,
    }).exec();
  }
}

export default new AnswerPicturesDAO();
