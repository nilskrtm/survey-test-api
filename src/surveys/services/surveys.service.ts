import SurveysDAO from '../daos/surveys.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateSurveyDTO } from '../dto/create.survey.dto';
import { PatchSurveyDTO } from '../dto/patch.survey.dto';
import { PutSurveyDTO } from '../dto/put.survey.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class SurveysService implements CRUD {
  async create(resource: CreateSurveyDTO) {
    return await SurveysDAO.addSurvey(resource);
  }

  async deleteById(id: string): Promise<any> {
    return await SurveysDAO.removeSurveyById(id, true);
  }

  async list(options: RequestOptions, ownerId: string): Promise<any> {
    return await SurveysDAO.getSurveysOfOwner(options, ownerId);
  }

  async patchById(id: string, resource: PatchSurveyDTO): Promise<any> {
    return await SurveysDAO.updateSurveyById(id, {
      ...resource,
      edited: new Date(),
    });
  }

  async getById(id: string): Promise<any> {
    return await SurveysDAO.getSurveyById(id);
  }

  async putById(id: string, resource: PutSurveyDTO): Promise<any> {
    return await SurveysDAO.updateSurveyById(id, resource);
  }
}

export default new SurveysService();
