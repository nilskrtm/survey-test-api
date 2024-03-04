import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { CreateSurveyDTO } from '../dto/create.survey.dto';
import { PatchSurveyDTO } from '../dto/patch.survey.dto';
import { PutSurveyDTO } from '../dto/put.survey.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { DAO } from '../../common/classes/dao.class';
import QuestionsDAO from '../../questions/daos/questions.dao';
import VotingsDAO from '../../votings/daos/votings.dao';
import { PagingParams } from '../../common/types/paging.params.type';
import SurveyQueryHelpers, {
  ISurveyQueryHelpers,
} from '../query/surveys.query.helpers';
import { RequestOptions } from '../../common/interfaces/request.options.interface';
import WebSocketService from '../../common/services/ws.service';
import { SubscriptionType } from '../../common/interfaces/websocket.data.inteface';
import { SurveyCreatedWSPayload } from '../../common/interfaces/websocket/survey.created.ws.payload';

const log: debug.IDebugger = debug('app:surveys-dao');

export type Survey = {
  _id: string;
  name: string;
  description: string;
  greeting: string;
  startDate: Date;
  endDate: Date;
  owner: {} | string;
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

type SurveyModelType = Model<Survey, ISurveyQueryHelpers>;

class SurveysDAO extends DAO<Survey> {
  SurveySchema: Schema<
    Survey,
    SurveyModelType,
    ISurveyQueryHelpers,
    {},
    ISurveyQueryHelpers
  >;
  SurveyModel: SurveyModelType;

  constructor() {
    super();

    this.SurveySchema = new Schema<
      Survey,
      SurveyModelType,
      ISurveyQueryHelpers,
      {},
      ISurveyQueryHelpers
    >(
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
      {
        id: false,
        collection: 'surveys',
        versionKey: false,
      },
    )
      .pre('findOneAndRemove', async function (this, next) {
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
      })
      .post('save', async function (this) {
        const survey: Survey = this;
        const payload: SurveyCreatedWSPayload = { _id: survey._id };

        WebSocketService.notifySubscriptions(
          survey.owner as string,
          SubscriptionType.SURVEY_CREATED,
          payload,
        );
        WebSocketService.notifySubscriptions(
          survey.owner as string,
          SubscriptionType.DASHBOARD_METRICS,
        );
      });

    this.SurveySchema.query = SurveyQueryHelpers;

    this.SurveyModel = mongooseService
      .getMongoose()
      .model<Survey, SurveyModelType>('Survey', this.SurveySchema);

    log('Created new instance of SurveysDAO');
  }

  getModel(): Model<Survey, ISurveyQueryHelpers> {
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

  async getSurveys(options: RequestOptions) {
    const count = (await this.SurveyModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      options.paging,
      count,
    );

    const surveys = await this.SurveyModel.find()
      .applyFiltering(options.filtering)
      .applySorting(options.sorting)
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

  async getSurveysOfOwner(options: RequestOptions, owner: string) {
    const count = (
      await this.SurveyModel.find({ owner: owner })
        .applyFiltering(options.filtering)
        .exec()
    ).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      options.paging,
      count,
    );

    const surveys = await this.SurveyModel.find({ owner: owner })
      .applyFiltering(options.filtering)
      .applySorting(options.sorting)
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

  async getSurveyCountOfOwner(owner: string) {
    return (await this.SurveyModel.find({ owner: owner }).exec()).length;
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
