import { CRUD } from '../../common/interfaces/crud.interface';
import VotingsDAO from '../../votings/daos/votings.dao';
import { CreateVotingDTO } from '../dto/create.voting.dto';
import { PatchVotingDTO } from '../dto/patch.voting.dto';
import { PutVotingDTO } from '../dto/put.voting.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class VotingsService implements CRUD {
  async create(resource: CreateVotingDTO) {
    return await VotingsDAO.addVoting(resource);
  }

  async deleteById(_id: string) {
    throw new Error('should not be used');
  }

  async list(_options: RequestOptions) {
    throw new Error('should not be used');
  }

  async patchById(_id: string, _resource: PatchVotingDTO) {
    throw new Error('should not be used');
  }

  async getById(_id: string) {
    throw new Error('should not be used');
  }

  async putById(_id: string, _resource: PutVotingDTO) {
    throw new Error('should not be used');
  }

  async getVotingsAbsoluteOfSurvey(surveyId: string) {
    return await VotingsDAO.getVotingsAbsoluteOfSurvey(surveyId);
  }

  async getVotingCountOfUser(userId: string) {
    return await VotingsDAO.getVotingCountOfUser(userId);
  }

  async getVotingCountOfSurvey(surveyId: string) {
    return await VotingsDAO.getVotingCountOfSurvey(surveyId);
  }
}

export default new VotingsService();
