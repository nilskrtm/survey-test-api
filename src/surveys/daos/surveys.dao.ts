import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import MongooseService from '../../common/services/mongoose.service';
import { CreateSurveyDTO } from '../dto/create.survey.dto';
import { PatchSurveyDTO } from '../dto/patch.survey.dto';
import { PutSurveyDTO } from '../dto/put.survey.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { DAO } from '../../common/classes/dao.class';
import QuestionsDAO, {
  PopulatedQuestion,
} from '../../questions/daos/questions.dao';
import VotingsDAO from '../../votings/daos/votings.dao';
import { PagingParams } from '../../common/types/paging.params.type';
import SurveyQueryHelpers, {
  ISurveyQueryHelpers,
} from '../query/surveys.query.helpers';
import { RequestOptions } from '../../common/interfaces/request.options.interface';
import WebSocketService from '../../common/services/ws.service';
import { SubscriptionType } from '../../common/interfaces/websocket.data.inteface';
import { SurveyCreatedWSPayload } from '../../common/interfaces/websocket/survey.created.ws.payload';
import { SurveyDeletedWSPayload } from '../../common/interfaces/websocket/survey.deleted.ws.payload';

const log: debug.IDebugger = debug('app:surveys-dao');

export type Survey = {
  _id: string;
  name: string;
  description: string;
  greeting: string;
  startDate: Date;
  endDate: Date;
  owner: string;
  created: Date;
  edited: Date;
  draft: boolean;
  archived: boolean;
  questions: Array<string>;
};

export type PopulatedSurvey = Omit<Survey, 'questions'> & {
  // 'owner' never gets populated
  questions: Array<PopulatedQuestion>;
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
        name: { type: String, default: 'Neue Umfrage' },
        description: { type: String, default: 'Noch keine Beschreibung' },
        greeting: { type: String, default: 'Noch keine Begrüßung' },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: Date.now },
        owner: { type: String, ref: 'User' },
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now },
        draft: { type: Boolean, default: true },
        archived: { type: Boolean, default: false },
        questions: [{ type: String, ref: 'Question', default: [] }],
      },
      {
        id: false,
        collection: 'surveys',
        versionKey: false,
      },
    )
      .pre('deleteOne', async function (this, next) {
        // cascade-handler
        if (!DAO.isCascadeRemoval(this)) {
          return next();
        }

        const survey: Survey = await this.model.findOne(this.getQuery()).exec();
        const promises: Promise<any>[] = survey.questions.map(questionId =>
          QuestionsDAO.removeQuestionById(questionId, true),
        );

        promises.push(VotingsDAO.removeVotingsOfSurvey(survey._id));

        await Promise.all(promises);

        const payload: SurveyDeletedWSPayload = { _id: survey._id };

        WebSocketService.notifySubscriptions(
          survey.owner as string,
          SubscriptionType.SURVEY_DELETED,
          payload,
        );

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

    this.SurveyModel = MongooseService.getMongoose().model<
      Survey,
      SurveyModelType
    >('Survey', this.SurveySchema);

    log('Created new instance of SurveysDAO');
  }

  getModel(): Model<Survey, ISurveyQueryHelpers> {
    return this.SurveyModel;
  }

  async addSurvey(surveyFields: CreateSurveyDTO) {
    const surveyId = uuid();
    let valuesWithName: Partial<Pick<Survey, 'name'>> = {};

    if (
      !('name' in surveyFields) &&
      !surveyFields.name &&
      'owner' in surveyFields &&
      surveyFields.owner
    ) {
      valuesWithName = {
        name:
          'Umfrage ' +
          Number(
            (await this.SurveyModel.find({ owner: surveyFields.owner }).exec())
              .length + 1,
          ),
      };
    }

    const survey = new this.SurveyModel({
      _id: surveyId,
      ...valuesWithName,
      ...surveyFields,
    });

    await survey.save();

    return surveyId;
  }

  async getSurveyById(surveyId: string) {
    return await this.SurveyModel.findOne({ _id: surveyId })
      .populate<Pick<PopulatedSurvey, 'questions'>>({
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
      .populate<Pick<PopulatedSurvey, 'questions'>>({
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
      .populate<Pick<PopulatedSurvey, 'questions'>>({
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
    return await this.SurveyModel.deleteOne({ _id: surveyId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new SurveysDAO();
