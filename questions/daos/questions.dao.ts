import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { CreateQuestionDTO } from '../dto/create.question.dto';
import { PatchQuestionDTO } from '../dto/patch.question.dto';
import { PutQuestionDTO } from '../dto/put.question.dto';
import { DAO } from '../../common/classes/dao.class';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import AnswerOptionsDAO from '../../answer.options/daos/answer.options.dao';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import {
  PagingParams,
  RequestPagingParams,
} from '../../common/types/paging.params.type';

const log: debug.IDebugger = debug('app:questions-dao');

export type Question = {
  _id: string;
  question: string;
  timeout: number;
  order: number;
  answerOptions: any[];
};

const defaultQuestionValues: Partial<Question> = {
  question: 'Frage noch nicht festgelegt',
  timeout: 30,
  answerOptions: [],
};

class QuestionsDAO extends DAO<Question> {
  questionSchema = new Schema<Question>(
    {
      _id: String,
      question: String,
      timeout: Number,
      order: Number,
      answerOptions: [{ type: String, ref: 'AnswerOption' }],
    },
    { id: false, collection: 'questions', versionKey: false },
  ).pre('findOneAndRemove', async function (this, next) {
    // cascade-handler
    if (!DAO.isCascadeRemoval(this)) {
      next();
    }

    const question: Question = await this.model.findOne(this.getQuery()).exec();
    const promises: Promise<any>[] = question.answerOptions.map(
      answerOptionId => AnswerOptionsDAO.removeAnswerOptionById(answerOptionId),
    );

    await Promise.all(promises);

    next();
  });

  QuestionModel = mongooseService
    .getMongoose()
    .model('Question', this.questionSchema);
  constructor() {
    super();

    log('Created new instance of QuestionsDao');
  }

  getModel() {
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
      .populate({
        path: 'answerOptions',
        populate: {
          path: 'picture',
        },
      })
      .exec();
  }

  async getQuestions(paging: RequestPagingParams) {
    const count = (await this.QuestionModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const questions = await this.QuestionModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .populate({
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
    return await this.QuestionModel.findOneAndRemove({ _id: questionId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new QuestionsDAO();
