import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { DAO } from '../../common/classes/dao.class';
import { CreateAnswerOptionDTO } from '../dto/create.answer.option.dto';
import { PatchAnswerOptionDTO } from '../dto/patch.answer.option.dto';
import { PutAnswerOptionDTO } from '../dto/put.answer.option.dto';
import QuestionsDAO from '../../questions/daos/questions.dao';
import { AnswerPicture } from '../../answer.pictures/daos/answer.pictures.dao';

const log: debug.IDebugger = debug('app:answer-options-dao');

export type AnswerOption = {
  _id: string;
  order: number;
  color: string;
  picture: string;
};

export type PopulatedAnswerOption = Omit<AnswerOption, 'picture'> & {
  picture: AnswerPicture;
};

const defaultAnswerOptionValues: Partial<AnswerOption> = {
  color: '',
  picture: '',
};

class AnswerOptionsDAO extends DAO<AnswerOption> {
  AnswerOptionSchema: Schema<AnswerOption>;
  AnswerOptionModel: Model<AnswerOption>;

  constructor() {
    super();

    this.AnswerOptionSchema = new Schema<AnswerOption>(
      {
        _id: String,
        order: Number,
        color: String,
        picture: { type: String, ref: 'AnswerPicture' },
      },
      { id: false, collection: 'answer_options', versionKey: false },
    );

    this.AnswerOptionModel = mongooseService
      .getMongoose()
      .model<AnswerOption>('AnswerOption', this.AnswerOptionSchema);

    log('Created new instance of AnswerOptionsDAO');
  }

  getModel(): Model<AnswerOption> {
    return this.AnswerOptionModel;
  }

  async addAnswerOption(answerOptionFields: CreateAnswerOptionDTO) {
    const answerOptionId = uuid();
    const answerOption = new this.AnswerOptionModel({
      _id: answerOptionId,
      ...defaultAnswerOptionValues,
      ...answerOptionFields,
    });

    await answerOption.save();

    return answerOptionId;
  }

  async getAnswerOptionById(answerOptionId: string) {
    return await this.AnswerOptionModel.findOne({ _id: answerOptionId })
      .populate({
        path: 'picture',
      })
      .exec();
  }

  /*
  async getAnswerOptions(paging: RequestPagingParams) {
    const count = (await this.AnswerOptionModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const answerOptions = await this.AnswerOptionModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .populate<Pick<PopulatedAnswerOption, 'picture'>>({
        path: 'picture',
      })
      .exec();

    delete pagingParams.offset;

    return {
      answerOptions: answerOptions,
      paging: pagingParams,
    };
  }
  */

  async getAnswerOptionsOfQuestion(questionId: string) {
    const question = await QuestionsDAO.getQuestionById(questionId);

    if (!question) {
      return {
        answerOptions: [],
      };
    }

    return {
      answerOptions: question.answerOptions,
    };
  }

  async updateAnswerOptionById(
    answerOptionId: string,
    answerOptionFields: PatchAnswerOptionDTO | PutAnswerOptionDTO,
  ) {
    return await this.AnswerOptionModel.findOneAndUpdate(
      { _id: answerOptionId },
      { $set: answerOptionFields },
      { new: true },
    ).exec();
  }

  async removeAnswerOptionById(answerOptionId: string) {
    return await this.AnswerOptionModel.findOneAndRemove({
      _id: answerOptionId,
    }).exec();
  }
}

export default new AnswerOptionsDAO();
