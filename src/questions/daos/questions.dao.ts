import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import MongooseService from '../../common/services/mongoose.service';
import { CreateQuestionDTO } from '../dto/create.question.dto';
import { PatchQuestionDTO } from '../dto/patch.question.dto';
import { PutQuestionDTO } from '../dto/put.question.dto';
import { DAO } from '../../common/classes/dao.class';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import AnswerOptionsDAO, {
  PopulatedAnswerOption,
} from '../../answer.options/daos/answer.options.dao';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { PagingParams } from '../../common/types/paging.params.type';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

const log: debug.IDebugger = debug('app:questions-dao');

export type Question = {
  _id: string;
  question: string;
  timeout: number;
  order: number;
  answerOptions: Array<string>;
};

export type PopulatedQuestion = Omit<Question, 'answerOptions'> & {
  answerOptions: Array<PopulatedAnswerOption>;
};

const defaultQuestionValues: Partial<Question> = {
  question: 'Frage noch nicht festgelegt',
  timeout: 30,
  answerOptions: [],
};

class QuestionsDAO extends DAO<Question> {
  QuestionSchema: Schema<Question>;
  QuestionModel: Model<Question>;

  constructor() {
    super();

    this.QuestionSchema = new Schema<Question>(
      {
        _id: String,
        question: String,
        timeout: Number,
        order: Number,
        answerOptions: [{ type: String, ref: 'AnswerOption' }],
      },
      { id: false, collection: 'questions', versionKey: false },
    ).pre('deleteOne', async function (this, next) {
      // cascade-handler
      if (!DAO.isCascadeRemoval(this)) {
        return next();
      }

      const question: Question = await this.model
        .findOne(this.getQuery())
        .exec();
      const promises: Promise<any>[] = question.answerOptions.map(
        answerOptionId =>
          AnswerOptionsDAO.removeAnswerOptionById(answerOptionId),
      );

      await Promise.all(promises);

      next();
    });

    this.QuestionModel = MongooseService.getMongoose().model<Question>(
      'Question',
      this.QuestionSchema,
    );

    log('Created new instance of QuestionsDAO');
  }

  getModel(): Model<Question> {
    return this.QuestionModel;
  }

  async addQuestion(questionFields: CreateQuestionDTO) {
    const questionId = uuid();
    const question = new this.QuestionModel({
      _id: questionId,
      ...defaultQuestionValues,
      ...questionFields,
    });

    await question.save();

    return questionId;
  }

  async getQuestionById(questionId: string) {
    return await this.QuestionModel.findOne({ _id: questionId })
      .populate<Pick<PopulatedQuestion, 'answerOptions'>>({
        path: 'answerOptions',
        populate: {
          path: 'picture',
        },
      })
      .exec();
  }

  async getQuestions(options: RequestOptions) {
    const count = (await this.QuestionModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      options.paging,
      count,
    );

    const questions = await this.QuestionModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .populate<Pick<PopulatedQuestion, 'answerOptions'>>({
        path: 'answerOptions',
        populate: {
          path: 'picture',
        },
      })
      .exec();

    delete pagingParams.offset;

    return {
      questions: questions,
      paging: pagingParams,
    };
  }

  async getQuestionsOfSurvey(surveyId: string) {
    const survey = await SurveysDAO.getSurveyById(surveyId);

    if (!survey) {
      return {
        questions: [],
      };
    }

    return {
      questions: survey.questions,
    };
  }

  async updateQuestionById(
    questionId: string,
    questionFields: PatchQuestionDTO | PutQuestionDTO,
  ) {
    return await this.QuestionModel.findOneAndUpdate(
      { _id: questionId },
      { $set: questionFields },
      { new: true },
    ).exec();
  }

  async removeQuestionById(questionId: string, cascade?: boolean) {
    return await this.QuestionModel.deleteOne({ _id: questionId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new QuestionsDAO();
