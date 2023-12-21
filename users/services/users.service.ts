import UsersDAO from '../daos/users.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateUserDTO } from '../dto/create.user.dto';
import { PutUserDTO } from '../dto/put.user.dto';
import { PatchUserDTO } from '../dto/patch.user.dto';

class UsersService implements CRUD {
  async create(resource: CreateUserDTO) {
    return await UsersDAO.addUser(resource);
  }

  async deleteById(id: string) {
    return await UsersDAO.removeUserById(id);
  }

  async list(paging: RequestPagingParams) {
    return await UsersDAO.getUsers(paging);
  }

  async patchById(id: string, resource: PatchUserDTO) {
    return await UsersDAO.updateUserById(id, resource);
  }

  async getById(id: string) {
    return await UsersDAO.getUserById(id);
  }

  async putById(id: string, resource: PutUserDTO) {
    return await UsersDAO.updateUserById(id, resource);
  }

  async getUserByUsername(username: string) {
    return await UsersDAO.getUserByUsername(username);
  }

  async getUserByUsernameWithAccessKey(username: string) {
    return await UsersDAO.getUserByUsernameWithAccessKey(username);
  }

  async getUserByUsernameWithPassword(username: string) {
    return await UsersDAO.getUserByUsernameWithPassword(username);
  }
}

export default new UsersService();
