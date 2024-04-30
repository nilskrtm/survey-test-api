import QuestionsDAO from '../daos/questions.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateQuestionDTO } from '../dto/create.question.dto';
import { PatchQuestionDTO } from '../dto/patch.question.dto';
import { PutQuestionDTO } from '../dto/put.question.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class QuestionsService implements CRUD {
  async create(resource: CreateQuestionDTO) {
    return await QuestionsDAO.addQuestion(resource);
  }

  async deleteById(id: string) {
    return await QuestionsDAO.removeQuestionById(id, true);
  }

  async list(options: RequestOptions, surveyId: string) {
    return await QuestionsDAO.getQuestionsOfSurvey(surveyId);
  }

  async patchById(id: string, resource: PatchQuestionDTO) {
    return await QuestionsDAO.updateQuestionById(id, resource);
  }

  async getById(id: string) {
    return await QuestionsDAO.getQuestionById(id);
  }

  async putById(id: string, resource: PutQuestionDTO) {
    return await QuestionsDAO.updateQuestionById(id, resource);
  }
}

export default new QuestionsService();
