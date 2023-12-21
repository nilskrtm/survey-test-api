import AnswerPicturesDAO from '../daos/answer.pictures.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateAnswerPictureDTO } from '../dto/create.answer.picture.dto';
import { PatchAnswerPictureDTO } from '../dto/patch.answer.picture.dto';
import { PutAnswerPictureDTO } from '../dto/put.answer.picture.dto';

class AnswerPicturesService implements CRUD {
  async create(resource: CreateAnswerPictureDTO) {
    return await AnswerPicturesDAO.addAnswerPicture(resource);
  }

  async deleteById(id: string): Promise<any> {
    return await AnswerPicturesDAO.removeAnswerPictureById(id);
  }

  async list(paging: RequestPagingParams, userId: string): Promise<any> {
    return await AnswerPicturesDAO.getAnswerPicturesOfUser(paging, userId);
  }

  async patchById(id: string, resource: PatchAnswerPictureDTO): Promise<any> {
    return await AnswerPicturesDAO.updateAnswerPictureById(id, resource);
  }

  async getById(id: string): Promise<any> {
    return await AnswerPicturesDAO.getAnswerPictureById(id);
  }

  async putById(id: string, resource: PutAnswerPictureDTO): Promise<any> {
    return await AnswerPicturesDAO.updateAnswerPictureById(id, resource);
  }
}

export default new AnswerPicturesService();
