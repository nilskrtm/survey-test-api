import AnswerPicturesDAO from '../daos/answer.pictures.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateAnswerPictureDTO } from '../dto/create.answer.picture.dto';
import { PatchAnswerPictureDTO } from '../dto/patch.answer.picture.dto';
import { PutAnswerPictureDTO } from '../dto/put.answer.picture.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class AnswerPicturesService implements CRUD {
  async create(resource: CreateAnswerPictureDTO) {
    return await AnswerPicturesDAO.addAnswerPicture(resource);
  }

  async deleteById(id: string) {
    return await AnswerPicturesDAO.removeAnswerPictureById(id);
  }

  async list(options: RequestOptions, userId: string) {
    return await AnswerPicturesDAO.getAnswerPicturesOfUser(options, userId);
  }

  async patchById(id: string, resource: PatchAnswerPictureDTO) {
    return await AnswerPicturesDAO.updateAnswerPictureById(id, resource);
  }

  async getById(id: string) {
    return await AnswerPicturesDAO.getAnswerPictureById(id);
  }

  async putById(id: string, resource: PutAnswerPictureDTO) {
    return await AnswerPicturesDAO.updateAnswerPictureById(id, resource);
  }
}

export default new AnswerPicturesService();
