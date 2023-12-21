import AnswerOptionsDAO from '../daos/answer.options.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateAnswerOptionDTO } from '../dto/create.answer.option.dto';
import { PatchAnswerOptionDTO } from '../dto/patch.answer.option.dto';
import { PutAnswerOptionDTO } from '../dto/put.answer.option.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';

class AnswerOptionsService implements CRUD {
  async create(resource: CreateAnswerOptionDTO) {
    return await AnswerOptionsDAO.addAnswerOption(resource);
  }

  async deleteById(id: string): Promise<any> {
    return await AnswerOptionsDAO.removeAnswerOptionById(id);
  }

  async list(paging: RequestPagingParams, questionId: string): Promise<any> {
    PagingMiddleware.ignoreValue(paging);

    return await AnswerOptionsDAO.getAnswerOptionsOfQuestion(questionId);
  }

  async patchById(id: string, resource: PatchAnswerOptionDTO): Promise<any> {
    return await AnswerOptionsDAO.updateAnswerOptionById(id, resource);
  }

  async getById(id: string): Promise<any> {
    return await AnswerOptionsDAO.getAnswerOptionById(id);
  }

  async putById(id: string, resource: PutAnswerOptionDTO): Promise<any> {
    return await AnswerOptionsDAO.updateAnswerOptionById(id, resource);
  }
}

export default new AnswerOptionsService();
