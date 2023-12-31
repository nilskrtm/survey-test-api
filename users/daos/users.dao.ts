import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import mongooseService from '../../common/services/mongoose.service';
import { CreateUserDTO } from '../dto/create.user.dto';
import { PatchUserDTO } from '../dto/patch.user.dto';
import { PutUserDTO } from '../dto/put.user.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { DAO } from '../../common/classes/dao.class';
import { PermissionLevel } from '../../common/enums/common.permissionlevel.enum';
import SurveysDAO, { Survey } from '../../surveys/daos/surveys.dao';
import {
  PagingParams,
  RequestPagingParams,
} from '../../common/types/paging.params.type';

const log: debug.IDebugger = debug('app:users-dao');

export type User = {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string | {};
  accessKey: string | {};
  permissionLevel: number;
};

const defaultUserValues: Partial<User> = {
  accessKey: '',
  permissionLevel: PermissionLevel.USER,
};

class UsersDAO extends DAO<User> {
  UserSchema: Schema<User>;
  UserModel: Model<User>;

  constructor() {
    super();

    this.UserSchema = new Schema<User>(
      {
        _id: String,
        username: String,
        email: String,
        firstname: String,
        lastname: String,
        password: { type: String, select: false },
        accessKey: { type: String, select: false },
        permissionLevel: Number,
      },
      { id: false, collection: 'users', versionKey: false },
    ).pre('findOneAndRemove', async function (this, next) {
      // cascade-handler
      if (!DAO.isCascadeRemoval(this)) {
        next();
      }

      const user: User = await this.model.findOne(this.getQuery()).exec();
      const surveys: Survey[] = await SurveysDAO.getModel()
        .find({ owner: user._id })
        .exec();
      const promises: Promise<any>[] = surveys.map(survey =>
        SurveysDAO.removeSurveyById(survey._id, true),
      );

      await Promise.all(promises);

      next();
    });

    this.UserModel = mongooseService
      .getMongoose()
      .model<User>('user', this.UserSchema);

    log('Created new instance of UsersDAO');
  }

  getModel(): Model<User> {
    return this.UserModel;
  }

  async addUser(userFields: CreateUserDTO) {
    const userId = uuid();
    const user = new this.UserModel({
      _id: userId,
      ...defaultUserValues,
      ...userFields,
    });

    await user.save();

    return userId;
  }

  async getUserByUsername(username: string) {
    return await this.UserModel.findOne({ username: username }).exec();
  }

  async getUserByEmail(email: string) {
    return await this.UserModel.findOne({ email: email }).exec();
  }

  async getUserByUsernameWithAccessKey(username: string) {
    return await this.UserModel.findOne({ username: username })
      .select(
        '_id username email firstname lastname permissionLevel +accessKey',
      )
      .exec();
  }

  async getUserByUsernameWithPassword(username: string) {
    return await this.UserModel.findOne({ username: username })
      .select('_id username email firstname lastname permissionLevel +password')
      .exec();
  }

  async getUserById(userId: string) {
    return await this.UserModel.findOne({ _id: userId }).exec();
  }

  async getUsers(paging: RequestPagingParams) {
    const count = (await this.UserModel.find().exec()).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      paging,
      count,
    );

    const users = await this.UserModel.find()
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .exec();

    delete pagingParams.offset;

    return {
      data: users,
      paging: pagingParams,
    };
  }

  async updateUserById(userId: string, userFields: PatchUserDTO | PutUserDTO) {
    return await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true },
    ).exec();
  }

  async removeUserById(userId: string, cascade?: boolean) {
    return await this.UserModel.findOneAndRemove({ _id: userId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new UsersDAO();
