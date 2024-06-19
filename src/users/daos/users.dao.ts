import debug from 'debug';
import { v4 as uuid } from 'uuid';
import { Model, Schema } from 'mongoose';
import MongooseService from '../../common/services/mongoose.service';
import { CreateUserDTO } from '../dto/create.user.dto';
import { PatchUserDTO } from '../dto/patch.user.dto';
import { PutUserDTO } from '../dto/put.user.dto';
import PagingMiddleware from '../../common/middleware/paging.middleware';
import { DAO } from '../../common/classes/dao.class';
import { PermissionLevel } from '../../common/enums/common.permissionlevel.enum';
import SurveysDAO, { Survey } from '../../surveys/daos/surveys.dao';
import { PagingParams } from '../../common/types/paging.params.type';
import { UserDataWSPayload } from '../../common/interfaces/websocket/user.data.ws.payload';
import WebSocketService from '../../common/services/ws.service';
import { SubscriptionType } from '../../common/interfaces/websocket.data.inteface';
import { RequestOptions } from '../../common/interfaces/request.options.interface';
import { generateAccessKey } from '../../common/utils/access.key.util';
import UserQueryHelpers, {
  IUserQueryHelpers,
} from '../../users/query/users.query.helpers';

const log: debug.IDebugger = debug('app:users-dao');

export type User = {
  _id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  accessKey: string;
  permissionLevel: number;
};

type UserModelType = Model<User, IUserQueryHelpers>;

class UsersDAO extends DAO<User> {
  UserSchema: Schema<
    User,
    UserModelType,
    IUserQueryHelpers,
    {},
    IUserQueryHelpers
  >;
  UserModel: UserModelType;

  constructor() {
    super();

    this.UserSchema = new Schema<
      User,
      UserModelType,
      IUserQueryHelpers,
      {},
      IUserQueryHelpers
    >(
      {
        _id: String,
        username: String,
        email: String,
        firstname: String,
        lastname: String,
        password: { type: String, select: false },
        accessKey: { type: String, select: false, default: generateAccessKey },
        permissionLevel: { type: Number, default: PermissionLevel.USER },
      },
      { id: false, collection: 'users', versionKey: false },
    )
      .pre('findOneAndRemove', async function (this, next) {
        // cascade-handler
        if (!DAO.isCascadeRemoval(this)) {
          return next();
        }

        const user: User = await this.model.findOne(this.getQuery()).exec();
        const surveys: Survey[] = await SurveysDAO.getModel()
          .find({ owner: user._id })
          .exec();
        const surveyPromises: Promise<any>[] = surveys.map(survey =>
          SurveysDAO.removeSurveyById(survey._id, true),
        );

        await Promise.all(surveyPromises);

        next();
      })
      .post('findOneAndUpdate', async function (this) {
        const user: User = await this.model.findOne(this.getQuery()).exec();
        const payload: UserDataWSPayload = {
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          permissionLevel: user.permissionLevel,
        };

        WebSocketService.notifySubscriptions(
          user._id,
          SubscriptionType.USER_DATA,
          payload,
        );
      });

    this.UserSchema.query = UserQueryHelpers;

    this.UserModel = MongooseService.getMongoose().model<User, UserModelType>(
      'user',
      this.UserSchema,
    );

    log('Created new instance of UsersDAO');
  }

  getModel(): Model<User, IUserQueryHelpers> {
    return this.UserModel;
  }

  async addUser(userFields: CreateUserDTO) {
    const userId = uuid();
    const user = new this.UserModel({
      _id: userId,
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

  async getUserByIdWithPassword(userId: string) {
    return await this.UserModel.findOne({ _id: userId })
      .select('_id username email firstname lastname permissionLevel +password')
      .exec();
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

  async getUserByEmailWithAccessKey(email: string) {
    return await this.UserModel.findOne({ email: email })
      .select(
        '_id username email firstname lastname permissionLevel +accessKey',
      )
      .exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return await this.UserModel.findOne({ email: email })
      .select('_id username email firstname lastname permissionLevel +password')
      .exec();
  }

  async getUserById(userId: string) {
    return await this.UserModel.findOne({ _id: userId }).exec();
  }

  async getUserByIdWithAccessKey(userId: string) {
    return await this.UserModel.findOne({ _id: userId })
      .select(
        '_id username email firstname lastname permissionLevel +accessKey',
      )
      .exec();
  }

  async getUsers(options: RequestOptions) {
    const count = (
      await this.UserModel.find().applyFiltering(options.filtering).exec()
    ).length;
    const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
      options.paging,
      count,
    );

    const users = await this.UserModel.find()
      .applyFiltering(options.filtering)
      .applySorting(options.sorting)
      .limit(pagingParams.perPage)
      .skip(pagingParams.offset || 0)
      .exec();

    delete pagingParams.offset;

    return {
      users: users,
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
    return await this.UserModel.deleteOne({ _id: userId })
      .setOptions({
        comment: {
          cascade: cascade ? cascade : false,
        },
      })
      .exec();
  }
}

export default new UsersDAO();
