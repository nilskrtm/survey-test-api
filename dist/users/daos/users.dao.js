"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const mongoose_service_1 = __importDefault(require("../../common/services/mongoose.service"));
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
const dao_class_1 = require("../../common/classes/dao.class");
const common_permissionlevel_enum_1 = require("../../common/enums/common.permissionlevel.enum");
const surveys_dao_1 = __importDefault(require("../../surveys/daos/surveys.dao"));
const log = (0, debug_1.default)('app:users-dao');
const defaultUserValues = {
    accessKey: '',
    permissionLevel: common_permissionlevel_enum_1.PermissionLevel.USER,
};
class UsersDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.UserSchema = new mongoose_1.Schema({
            _id: String,
            username: String,
            firstName: String,
            lastName: String,
            password: { type: String, select: false },
            accessKey: { type: String, select: false },
            permissionLevel: Number,
        }, { id: false, collection: 'users', versionKey: false }).pre('findOneAndRemove', function (next) {
            return __awaiter(this, void 0, void 0, function* () {
                // cascade-handler
                if (!dao_class_1.DAO.isCascadeRemoval(this)) {
                    next();
                }
                const user = yield this.model.findOne(this.getQuery()).exec();
                const surveys = yield surveys_dao_1.default.getModel()
                    .find({ owner: user._id })
                    .exec();
                const promises = surveys.map(survey => surveys_dao_1.default.removeSurveyById(survey._id, true));
                yield Promise.all(promises);
                next();
            });
        });
        this.UserModel = mongoose_service_1.default
            .getMongoose()
            .model('user', this.UserSchema);
        log('Created new instance of UsersDao');
    }
    getModel() {
        return this.UserModel;
    }
    addUser(userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, uuid_1.v4)();
            const user = new this.UserModel(Object.assign(Object.assign({ _id: userId }, defaultUserValues), userFields));
            yield user.save();
            return userId;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ username: username }).exec();
        });
    }
    getUserByUsernameWithAccessKey(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ username: username })
                .select('_id username permissionLevel +accessKey')
                .exec();
        });
    }
    getUserByUsernameWithPassword(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ username: username })
                .select('_id username permissionLevel +password')
                .exec();
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({ _id: userId }).exec();
        });
    }
    getUsers(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.UserModel.find().exec()).length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const users = yield this.UserModel.find()
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .exec();
            delete pagingParams.offset;
            return {
                data: users,
                paging: pagingParams,
            };
        });
    }
    updateUserById(userId, userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOneAndUpdate({ _id: userId }, { $set: userFields }, { new: true }).exec();
        });
    }
    removeUserById(userId, cascade) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOneAndRemove({ _id: userId })
                .setOptions({
                comment: {
                    cascade: cascade ? cascade : false,
                },
            })
                .exec();
        });
    }
}
exports.default = new UsersDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuZGFvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdXNlcnMvZGFvcy91c2Vycy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsK0JBQWdDO0FBQ2hDLHVDQUF1QztBQUN2Qyw4RkFBcUU7QUFJckUsa0dBQXlFO0FBQ3pFLDhEQUFtRDtBQUNuRCxnR0FBK0U7QUFDL0UsaUZBQWtFO0FBRWxFLE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyxlQUFlLENBQUMsQ0FBQztBQVlwRCxNQUFNLGlCQUFpQixHQUFrQjtJQUN2QyxTQUFTLEVBQUUsRUFBRTtJQUNiLGVBQWUsRUFBRSw2Q0FBZSxDQUFDLElBQUk7Q0FDdEMsQ0FBQztBQUVGLE1BQU0sUUFBUyxTQUFRLGVBQVM7SUFJOUI7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxpQkFBTSxDQUMxQjtZQUNFLEdBQUcsRUFBRSxNQUFNO1lBQ1gsUUFBUSxFQUFFLE1BQU07WUFDaEIsU0FBUyxFQUFFLE1BQU07WUFDakIsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO1lBQ3ZDLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztZQUN4QyxlQUFlLEVBQUUsTUFBTTtTQUN4QixFQUNELEVBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FDcEQsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsVUFBc0IsSUFBSTs7Z0JBQ2xELGtCQUFrQjtnQkFDbEIsSUFBSSxDQUFDLGVBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDL0IsSUFBSSxFQUFF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