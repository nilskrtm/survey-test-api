import debug from 'debug';
import { DAO } from '../../common/classes/dao.class';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { v4 as uuid } from 'uuid';
import { CreateVotingDTO } from '../dto/create.voting.dto';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import {
  formatDateYYYmmdd,
  getDatesBetweenDates,
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

  async getVotingsAbsoluteOfSurvey(surveyId: string) {
    const answerOptionsVotes = await SurveysDAO.getModel()
      .aggregate<{
        questionId: string;
        answerOptions: [{ answerOptionId: string; count: number }];
        count: number;
      }>([
        {
          $match: {
            _id: surveyId,
          },
        },
        {
          $unwind: '$questions',
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
            count: {
              $size: '$votings',
            },
          },
        },
        {
          $group: {
            _id: '$questionId',
            questionId: {
              $first: '$questionId',
            },
            answerOptions: {
              $push: {
                answerOptionId: '$answerOptionId',
                count: '$count',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            questionId: '$questionId',
            answerOptions: '$answerOptions',
          },
        },
      ])
      .exec();

    return { questions: answerOptionsVotes };
  }

  async getVotingsAbsoluteOfSurveyByQuestion(
    surveyId: string,
    questionId: string,
  ) {
    const answerOptionsVotes = await SurveysDAO.getModel()
      .aggregate<{
        questionId: string;
        answerOptions: [{ answerOptionId: string; count: number }];
        count: number;
      }>([
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
              $in: [questionId],
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
            count: {
              $size: '$votings',
            },
          },
        },
        {
          $group: {
            _id: '$questionId',
            questionId: {
              $first: '$questionId',
            },
            answerOptions: {
              $push: {
                answerOptionId: '$answerOptionId',
                count: '$count',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            questionId: '$questionId',
            answerOptions: '$answerOptions',
            count: {
              $sum: '$answerOptions.count',
            },
          },
        },
      ])
      .exec();

    const sum = answerOptionsVotes.reduce((accumulator, value) => {
      return accumulator + value.count;
    }, 0);

    return { answerOptions: answerOptionsVotes, count: sum };
  }

  async getVotingsDaySpanOfSurvey(
    surveyId: string,
    timezone: string,
    startDate: string,
    endDate: string,
  ) {
    const survey = await SurveysDAO.getSurveyById(surveyId);
    const questions: {
      questions: {
        [questionId: string]: {
          dates: {
            [date: string]: {
              votes: Array<{ answerOptionId: string; votes: number }>;
            };
          };
        };
      };
    } = { questions: {} };

    if (!survey) return questions;

    const dayVotes = [
      ...(await this.VotingModel.aggregate<{
        date: string;
        questionId: string;
        votings: Array<{ answerOptionId: string; votes: number }>;
      }>([
        {
          $match: {
            survey: surveyId,
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
            surveyId: '$survey',
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
            surveyId: {
              $first: '$surveyId',
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
            surveyId: '$surveyId',
            questionId: '$_id.questionId',
            answerOptionId: '$_id.answerOptionId',
            votes: '$votes',
          },
        },
        {
          $group: {
            _id: {
              date: '$date',
              questionId: '$questionId',
            },
            votings: {
              $push: {
                answerOptionId: '$answerOptionId',
                votes: {
                  $size: '$votes',
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id.date',
            questionId: '$_id.questionId',
            votings: '$votings',
          },
        },
      ]).exec()),
    ];
    const datesBetweenDates = getDatesBetweenDates(
      new Date(startDate),
      new Date(endDate),
    );
    const daysBetweenDates = datesBetweenDates.map(date =>
      formatDateYYYmmdd(date),
    );

    survey.questions.forEach(question => {
      const dates: {
        [date: string]: {
          votes: Array<{ answerOptionId: string; votes: number }>;
        };
      } = {};

      daysBetweenDates.forEach(day => {
        const dayVotesFound = dayVotes.find(
          dayVote =>
            dayVote.questionId === question._id && dayVote.date === day,
        );

        const votes: Array<{ answerOptionId: string; votes: number }> =
          question.answerOptions.map(answerOption => {
            let voteCount = 0;

            if (dayVotesFound) {
              const answerOptionVote = dayVotesFound.votings.find(
                answerOptionVotes =>
                  answerOptionVotes.answerOptionId === answerOption._id,
              );

              if (answerOptionVote) {
                voteCount = answerOptionVote.votes;
              }
            }

            return {
              answerOptionId: answerOption._id,
              votes: voteCount,
            };
          });

        dates[day] = { votes: votes };
      });

      questions.questions[question._id] = {
        dates: dates,
      };
    });

    return questions;
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
