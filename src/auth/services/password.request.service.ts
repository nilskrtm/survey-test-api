import PasswordRequestDAO from '../daos/password.request.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreatePasswordRequestDTO } from '../dto/create.password.request.dto';
import { PutPasswordRequestDTO } from '../dto/put.password.request.dto';
import { PatchPasswordRequestDTO } from '../dto/patch.password.request.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class PasswordRequestService implements CRUD {
  async create(resource: CreatePasswordRequestDTO) {
    return await PasswordRequestDAO.addPasswordRequest(resource);
  }

  // caution, used id is not the id of the document, but of the user's according password-requests
  async deleteById(userId: string) {
    return await PasswordRequestDAO.removePasswordRequestById(userId);
  }

  async list(_options: RequestOptions, _passwordRequestId: string) {
    throw new Error('should not be used');
  }

  async patchById(_id: string, _resource: PatchPasswordRequestDTO) {
    throw new Error('should not be used');
  }

  async getById(id: string) {
    return await PasswordRequestDAO.getPasswordRequestById(id);
  }

  async putById(_id: string, _resource: PutPasswordRequestDTO) {
    throw new Error('should not be used');
  }
}

export default new PasswordRequestService();
