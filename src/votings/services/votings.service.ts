import { CRUD } from '../../common/interfaces/crud.interface';
import VotingsDAO from '../../votings/daos/votings.dao';
import { CreateVotingDTO } from '../dto/create.voting.dto';
import { PatchVotingDTO } from '../dto/patch.voting.dto';
import { PutVotingDTO } from '../dto/put.voting.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class VotingsService implements CRUD {
  async create(resource: CreateVotingDTO) {
    return await VotingsDAO.addVoting(resource);
  }

  async deleteById(id: string): Promise<any> {
    PagingMiddleware.ignoreValue(id);

    throw new Error('should not be used');
    //return await VotingsDAO.removeSurveyById(id, true);
  }

  async list(options: RequestOptions): Promise<any> {
    PagingMiddleware.ignoreValue(options);

    throw new Error('should not be used');
    //return await VotingsDAO.getSurveysOfOwner(paging, ownerId);
  }

  async patchById(id: string, resource: PatchVotingDTO): Promise<any> {
    PagingMiddleware.ignoreValue(id);
    PagingMiddleware.ignoreValue(resource);

    throw new Error('should not be used');
    //return await VotingsDAO.updateSurveyById(id, resource);
  }

  async getById(id: string): Promise<any> {
    PagingMiddleware.ignoreValue(id);

    throw new Error('should not be used');
    //return await VotingsDAO.getSurveyById(id);
  }

  async putById(id: string, resource: PutVotingDTO): Promise<any> {
    PagingMiddleware.ignoreValue(id);
    PagingMiddleware.ignoreValue(resource);

    throw new Error('should not be used');
    //return await VotingsDAO.updateSurveyById(id, resource);
  }
}

export default new VotingsService();