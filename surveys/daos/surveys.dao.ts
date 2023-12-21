import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Schema, Model } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { CreateSurveyDTO } from '../dto/create.survey.dto';
import { PatchSurveyDTO } from '../dto/patch.survey.dto';
import { PutSurveyDTO } from '../dto/put.survey.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { DAO } from '../../common/classes/dao.class';
import QuestionsDAO from '../../questions/daos/questions.dao';
import VotingsDAO from '../../votings/daos/votings.dao';

const log: debug.IDebugger = debug('app:surveys-dao');

export type Survey = {
  _id: string;
  name: string;
  description: string;
  greeting: string;
  startDate: Date;
  endDate: Date;
  owner: {};
  created: Date;
  edited: Date;
  draft: boolean;
  archived: boolean;
  questions: any[];
};

const defaultSurveyValues: Partial<Survey> = {
  name: 'Neue Umfrage',
  description: 'Noch keine Beschreibung',
  greeting: 'Noch keine Begrüßung',
  startDate: new Date(),
  endDate: new Date(),
  created: new Date(),
  edited: new Date(),
  draft: true,
  archived: false,
  questions: [],
};

class SurveysDAO extends DAO<Survey> {
  surveySchema = new Schema<Survey>(
    {
      _id: String,
      name: String,
      description: String,
      greeting: String,
      startDate: Date,
      endDate: Date,
      owner: { type: String, ref: 'User' },
      created: Date,
      edited: Date,
      draft: Boolean,
      archived: Boolean,
      questions: [{ type: String, ref: 'Question' }],
    },
    { id: false, collection: 'surveys', versionKey: false },
  ).pre('findOneAndRemove', async function (this, next) {
    // cascade-handler
    if (!DAO.isCascadeRemoval(this)) {
      next();
    }

    const survey: Survey = await this.model.findOne(this.getQuery()).exec();
    const promises: Promise<any>[] = survey.questions.map(questionId =>
      QuestionsDAO.removeQuestionById(questionId, true),
    );

    promises.push(VotingsDAO.removeVotingsOfSurvey(survey._id));

    await Promise.all(promises);

    next();
  });

  SurveyModel = mongooseService
    .getMongoose()
    .model('Survey', this.surveySchema);

  constructor() {
    super();

    log('Created new instance of SurveysDao');
  }

  getModel(): Model<Survey> {
    return this.SurveyModel;
  }

  async addSurvey(surveyFields: CreateSurveyDTO) {
    const surveyId = uuid();
    const survey = new this.SurveyModel({
      _id: surveyId,
      ...defaultSurveyValues,
      ...surveyFields,
    });

    await survey.save();

    return surveyId;
  }

  async getSurveyById(surveyId: string) {
    return await this.SurveyModel.findOne({ _id: surveyId })
      .populate({
        path: 'questions',
        populate: {
          path: 'answerOptions',
          populate: {
            path: 'picture',
          },
        },
      })
      .exec();
  }

  async getSurveys(paging: RequestPagingParams) {
    const count = (await this.SurveyModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const surveys = await this.SurveyModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .populate({
        path: 'questions',
        populate: {
          path: 'answerOptions',
          populate: {
            path: 'picture',
          },
        },
      })
      .exec();

    delete pagingParams.offset;

    return {
      surveys: surveys,
      paging: pagingParams,
    };
  }

  async getSurveysOfOwner(paging: RequestPagingParams, owner: string) {
    const count = (await this.SurveyModel.find({ owner: owner }).exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const surveys = await this.SurveyModel.find({ owner: owner })
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .populate({
        path: 'questions',
        populate: {
          path: 'answerOptions',
          populate: {
            path: 'picture',
          },
        },
      })
      .exec();

    delete pagingParams.offset;

    return {
      surveys: surveys,
      paging: pagingParams,
    };
  }

  async updateSurveyById(
    surveyId: string,
    surveyFields: PatchSurveyDTO | PutSurveyDTO,
  ) {
    return await this.SurveyModel.findOneAndUpdate(
      { _id: surveyId },
      { $set: surveyFields },
      { new: true },
    ).exec();
  }

  async removeSurveyById(surveyId: string, cascade?: boolean) {
    return await this.SurveyModel.findOneAndRemove({ _id: surveyId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new SurveysDAO();
