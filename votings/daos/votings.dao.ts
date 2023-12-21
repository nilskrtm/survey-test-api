import debug from 'debug';
import { DAO } from '../../common/classes/dao.class';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { v4 as uuid } from 'uuid';
import { CreateVotingDTO } from '../dto/create.voting.dto';

const log: debug.IDebugger = debug('app:votings-dao');

export type Vote = {
  question: {};
  answerOption: {};
};

export type Voting = {
  _id: string;
  survey: {};
  date: Date;
  votes: any[];
};

const defaultVotingValues: Partial<Voting> = {};

class VotingsDAO extends DAO<Voting> {
  voteSchema = new Schema<Vote>(
    {
      question: { type: String, ref: 'Question' },
      answerOption: { type: String, ref: 'AnswerOption' },
    },
    { _id: false },
  );

  votingSchema = new Schema<Voting>(
    {
      _id: String,
      survey: { type: String, ref: 'Survey' },
      date: Date,
      votes: [this.voteSchema],
    },
    { id: false, collection: 'votings', versionKey: false },
  );

  VotingModel = mongooseService
    .getMongoose()
    .model('Voting', this.votingSchema);

  constructor() {
    super();

    log('Created new instance of VotingsDao');
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

  async removeVotingsOfSurvey(surveyId: string) {
    return await this.VotingModel.findOneAndRemove({
      survey: surveyId,
    }).exec();
  }
}

export default new VotingsDAO();
