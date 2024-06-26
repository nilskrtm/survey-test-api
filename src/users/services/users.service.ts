import UsersDAO from '../daos/users.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateUserDTO } from '../dto/create.user.dto';
import { PutUserDTO } from '../dto/put.user.dto';
import { PatchUserDTO } from '../dto/patch.user.dto';
import { RequestOptions } from '../../common/interfaces/request.options.interface';

class UsersService implements CRUD {
  async create(resource: CreateUserDTO) {
    return await UsersDAO.addUser(resource);
  }

  async deleteById(id: string) {
    return await UsersDAO.removeUserById(id);
  }

  async list(options: RequestOptions) {
    return await UsersDAO.getUsers(options);
  }

  async patchById(id: string, resource: PatchUserDTO) {
    return await UsersDAO.updateUserById(id, resource);
  }

  async getById(id: string) {
    return await UsersDAO.getUserById(id);
  }

  async getByIdWithAccessKey(id: string) {
    return await UsersDAO.getUserByIdWithAccessKey(id);
  }

  async putById(id: string, resource: PutUserDTO) {
    return await UsersDAO.updateUserById(id, resource);
  }

  async getUserByUsername(username: string) {
    return await UsersDAO.getUserByUsername(username);
  }

  async getUserByEmail(email: string) {
    return await UsersDAO.getUserByEmail(email);
  }

  async getUserByIdWithPassword(userId: string) {
    return await UsersDAO.getUserByIdWithPassword(userId);
  }

  async getUserByUsernameWithAccessKey(username: string) {
    return await UsersDAO.getUserByUsernameWithAccessKey(username);
  }

  async getUserByUsernameWithPassword(username: string) {
    return await UsersDAO.getUserByUsernameWithPassword(username);
  }

  async getUserByEmailWithAccessKey(email: string) {
    return await UsersDAO.getUserByEmailWithAccessKey(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return await UsersDAO.getUserByEmailWithPassword(email);
  }
}

export default new UsersService();
