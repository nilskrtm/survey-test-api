import debug from 'debug';
import { User } from '../../users/daos/users.dao';
import { DAO } from '../../common/classes/dao.class';
import { Model, Schema } from 'mongoose';
import MongooseService from '../../common/services/mongoose.service';
import { PatchPasswordRequestDTO } from '../dto/patch.password.request.dto';
import { PutPasswordRequestDTO } from '../dto/put.password.request.dto';
import { CreatePasswordRequestDTO } from '../dto/create.password.request.dto';
import { v4 as uuid } from 'uuid';

const log: debug.IDebugger = debug('app:password-reset-dao');

export type PasswordRequest = {
  _id: string;
  user: string;
  createdAt: Date;
};

export type PopulatedPasswordRequest = Omit<PasswordRequest, 'user'> & {
  user: User;
};

const defaultPasswordRequestValues: () => Partial<PasswordRequest> = () => {
  return {};
};

class PasswordRequestDAO extends DAO<PasswordRequest> {
  PasswordRequestSchema: Schema<PasswordRequest>;
  PasswordRequestModel: Model<PasswordRequest>;

  constructor() {
    super();

    this.PasswordRequestSchema = new Schema<PasswordRequest>(
      {
        _id: String,
        user: { type: String, ref: 'user' },
        createdAt: { type: Date, expires: '1h', default: Date.now },
      },
      { id: false, collection: 'password_requests', versionKey: false },
    );

    this.PasswordRequestModel =
      MongooseService.getMongoose().model<PasswordRequest>(
        'PasswordRequest',
        this.PasswordRequestSchema,
      );

    log('Created new instance of PasswordRequestDAO');
  }

  getModel(): Model<PasswordRequest> {
    return this.PasswordRequestModel;
  }

  async addPasswordRequest(passwordRequestFields: CreatePasswordRequestDTO) {
    const passwordRequestId = uuid();
    const defaultValues = defaultPasswordRequestValues();

    const passwordRequest = new this.PasswordRequestModel({
      _id: passwordRequestId,
      ...defaultValues,
      ...passwordRequestFields,
    });

    await passwordRequest.save();

    return passwordRequestId;
  }

  async getPasswordRequestById(passwordRequestId: string) {
    return await this.PasswordRequestModel.findOne({ _id: passwordRequestId })
      .populate<Pick<PopulatedPasswordRequest, 'user'>>({
        path: 'user',
      })
      .exec();
  }

  async updatePasswordRequestById(
    passwordRequestId: string,
    passwordRequestFields: PatchPasswordRequestDTO | PutPasswordRequestDTO,
  ) {
    return await this.PasswordRequestModel.findOneAndUpdate(
      { _id: passwordRequestId },
      { $set: passwordRequestFields },
      { new: true },
    ).exec();
  }

  async removePasswordRequestById(userId: string) {
    return await this.PasswordRequestModel.deleteMany({
      user: userId,
    }).exec();
  }
}

export default new PasswordRequestDAO();
