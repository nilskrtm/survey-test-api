import debug from 'debug';
import { DAO } from '../../common/classes/dao.class';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { v4 as uuid } from 'uuid';
import { CreateVotingDTO } from '../dto/create.voting.dto';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import {
  formatDateYYYmmdd,
  formateDayHH,
  getDatesBetweenDates,
  getHoursBetweenDates,
} from '../../common/utils/time.util';

const log: debug.IDebugger = debug('app:votings-dao');

export type Vote = {
  question: string;
  answerOption: string;
};

export type Voting = {
  _id: string;
  survey: string;
  date: Date;
  votes: Array<Vote>;
};

export type AbsoluteVotings = {
  questionId: string;
  answerOptionId: string;
  votes: number;
};

export type AbsoluteVotingsResponse = {
  votes: Array<AbsoluteVotings>;
};

export type DayVotings = {
  date: string;
  questionId: string;
  answerOptionId: string;
  votes: number;
};

export type DaySpanVotingsResponse = {
  votes: Array<DayVotings>;
  days: Array<string>;
};

export type HourVotings = {
  hour: string;
  questionId: string;
  answerOptionId: string;
  votes: number;
};

export type HourSpanVotingsResponse = {
  votes: Array<HourVotings>;
  hours: Array<string>;
};

const defaultVotingValues: Partial<Voting> = {};

class VotingsDAO extends DAO<Voting> {
  VoteSchema: Schema<Vote>;
  VotingSchema: Schema<Voting>;
  VotingModel: Model<Voting>;

  constructor() {
    super();

    this.VoteSchema = new Schema<Vote>(
      {
        question: { type: String, ref: 'Question' },
        answerOption: { type: String, ref: 'AnswerOption' },
      },
      { _id: false },
    );

    this.VotingSchema = new Schema<Voting>(
      {
        _id: String,
        survey: { type: String, ref: 'Survey' },
        date: Date,
        votes: [this.VoteSchema],
      },
      { id: false, collection: 'votings', versionKey: false },
    );
    this.VotingModel = mongooseService
      .getMongoose()
      .model<Voting>('Voting', this.VotingSchema);

    log('Created new instance of VotingsDAO');
  }

  getModel(): Model<Voting> {
    return this.VotingModel;
  }

  async addVoting(votingFields: CreateVotingDTO) {
    const votingId = uuid();
    const voting = new this.VotingModel({
      _id: votingId,
      ...defaultVotingValues,
      ...votingFields,
    });

    await voting.save();

    return votingId;
  }

  /*
  async getVotings(paging: RequestPagingParams) {
    const count = (await this.VotingModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const votings = await this.VotingModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .exec();

    delete pagingParams.offset;

    return {
      votings: votings,
      paging: pagingParams,
    };
  }
  */

  async getVotingCountOfUser(userId: string) {
    // TODO: do with query helpers

    return (
      await this.VotingModel.aggregate([
        { $unwind: '$survey' },
        {
          $lookup: {
            from: 'surveys',
            localField: 'survey',
            foreignField: '_id',
            as: 'survey',
          },
        },
        {
          $match: {
            'survey.owner': userId,
          },
        },
        { $group: { _id: '$_id' } },
      ]).exec()
    ).length;
  }

  async getVotingsAbsoluteOfSurvey(
    surveyId: string,
  ): Promise<AbsoluteVotingsResponse> {
    const survey = await SurveysDAO.getSurveyById(surveyId);

    if (!survey) return { votes: [] };

    const votes = await SurveysDAO.getModel()
      .aggregate<AbsoluteVotings>([
        {
          $match: {
            _id: surveyId,
          },
        },
        {
          $unwind: '$questions',
        },
        {
          $match: {
            questions: {
              $in: survey.questions.map(question => question._id),
            },
          },
        },
        {
          $project: {
            _id: 0,
            questionId: '$questions',
          },
        },
        {
          $lookup: {
            from: 'questions',
            localField: 'questionId',
            foreignField: '_id',
            as: 'question',
          },
        },
        {
          $set: {
            question: {
              $first: '$question',
            },
          },
        },
        {
          $project: {
            _id: 0,
            questionId: '$questionId',
            answerOptions: '$question.answerOptions',
          },
        },
        {
          $unwind: '$answerOptions',
        },
        {
          $lookup: {
            from: 'votings',
            localField: 'answerOptions',
            foreignField: 'votes.answerOption',
            as: 'votings',
          },
        },
        {
          $project: {
            _id: 0,
            questionId: '$questionId',
            answerOptionId: '$answerOptions',
            votes: {
              $size: '$votings',
            },
          },
        },
        /* check if following 3 stages are really needed, at first result without looks the same as with them */
        {
          $group: {
            _id: '$questionId',
            questionId: {
              $first: '$questionId',
            },
            answerOptions: {
              $push: {
                answerOptionId: '$answerOptionId',
                votes: '$votes',
              },
            },
          },
        },
        {
          $unwind: '$answerOptions',
        },
        {
          $project: {
            _id: 0,
            questionId: '$questionId',
            answerOptionId: '$answerOptions.answerOptionId',
            votes: '$answerOptions.votes',
          },
        },
      ])
      .exec();

    return { votes: votes };
  }

  async getVotingsDaySpanOfSurvey(
    surveyId: string,
    timezone: string,
    startDate: string,
    endDate: string,
  ): Promise<DaySpanVotingsResponse> {
    const survey = await SurveysDAO.getSurveyById(surveyId);

    if (!survey) return { votes: [], days: [] };

    const votes = [
      ...(await this.VotingModel.aggregate<DayVotings>([
        {
          $match: {
            survey: surveyId,
            // can be used later to only get votings for specific question(-s)
            'votes.question': {
              $in: survey.questions.map(question => question._id),
            },
            $and: [
              {
                date: {
                  $gt: new Date(startDate),
                },
              },
              {
                date: {
                  $lt: new Date(endDate),
                },
              },
            ],
          },
        },
        {
          $unwind: '$votes',
        },
        {
          $set: {
            question: '$votes.question',
            answerOption: '$votes.answerOption',
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                timezone: timezone,
                date: '$date',
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id',
            questionId: '$question',
            answerOptionId: '$answerOption',
            date: '$date',
          },
        },
        {
          $group: {
            _id: {
              date: '$date',
              questionId: '$questionId',
              answerOptionId: '$answerOptionId',
            },
            votes: {
              $push: '$_id',
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id.date',
            questionId: '$_id.questionId',
            answerOptionId: '$_id.answerOptionId',
            votes: {
              $size: '$votes',
            },
          },
        },
      ]).exec()),
    ];
    const daysBetweenDates = getDatesBetweenDates(
      new Date(startDate),
      new Date(endDate),
    ).map(formatDateYYYmmdd);

    return { votes: votes, days: daysBetweenDates };
  }

  async getVotingsHourSpanOfSurvey(
    surveyId: string,
    timezone: string,
    _dayDate: string,
    startDate: string,
    endDate: string,
  ): Promise<HourSpanVotingsResponse> {
    const survey = await SurveysDAO.getSurveyById(surveyId);

    if (!survey) return { votes: [], hours: [] };

    const votes = [
      ...(await this.VotingModel.aggregate<HourVotings>([
        {
          $match: {
            survey: 'd4a72159-d672-4ebd-af3c-255561cb13d8',
            // can be used later to only get votings for specific question(-s)
            'votes.question': {
              $in: survey.questions.map(question => question._id),
            },
            $and: [
              {
                date: {
                  $gt: new Date(startDate),
                },
              },
              {
                date: {
                  $lt: new Date(endDate),
                },
              },
            ],
          },
        },
        {
          $unwind: '$votes',
        },
        {
          $set: {
            question: '$votes.question',
            answerOption: '$votes.answerOption',
            hour: {
              $dateToString: {
                format: '%H',
                timezone: timezone,
                date: '$date',
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id',
            questionId: '$question',
            answerOptionId: '$answerOption',
            hour: '$hour',
          },
        },
        {
          $group: {
            _id: {
              hour: '$hour',
              questionId: '$questionId',
              answerOptionId: '$answerOptionId',
            },
            votes: {
              $push: '$_id',
            },
          },
        },
        {
          $project: {
            _id: 0,
            hour: '$_id.hour',
            questionId: '$_id.questionId',
            answerOptionId: '$_id.answerOptionId',
            votes: {
              $size: '$votes',
            },
          },
        },
      ]).exec()),
    ];
    const hoursBetweenDates = getHoursBetweenDates(
      new Date(startDate),
      new Date(endDate),
    ).map(formateDayHH);

    return { votes: votes, hours: hoursBetweenDates };
  }

  async getVotingCountOfSurvey(surveyId: string) {
    return (await this.VotingModel.find({ survey: surveyId }).exec()).length;
  }

  async removeVotingsOfSurvey(surveyId: string) {
    return await this.VotingModel.findOneAndRemove({
      survey: surveyId,
    }).exec();
  }
}

export default new VotingsDAO();
