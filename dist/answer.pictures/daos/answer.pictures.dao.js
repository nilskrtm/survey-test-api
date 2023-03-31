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
const dao_class_1 = require("../../common/classes/dao.class");
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
const log = (0, debug_1.default)('app:answer-pictures-dao');
const defaultAnswerPictureValues = {
    name: 'Name noch nicht festgelegt',
    fileName: '',
    created: new Date(),
    edited: new Date(),
};
class AnswerPicturesDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.answerPictureSchema = new mongoose_1.Schema({
            _id: String,
            name: String,
            fileName: String,
            owner: { type: String, ref: 'User' },
            created: Date,
            edited: Date,
        }, { id: false, collection: 'answer_pictures', versionKey: false });
        this.AnswerPictureModel = mongoose_service_1.default
            .getMongoose()
            .model('AnswerPicture', this.answerPictureSchema);
        log('Created new instance of AnswerPicturesDao');
    }
    getModel() {
        return this.AnswerPictureModel;
    }
    addAnswerPicture(answerPictureFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPictureId = (0, uuid_1.v4)();
            const answerPicture = new this.AnswerPictureModel(Object.assign(Object.assign({ _id: answerPictureId }, defaultAnswerPictureValues), answerPictureFields));
            yield answerPicture.save();
            return answerPictureId;
        });
    }
    getAnswerPictureById(answerPictureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerPictureModel.findOne({ _id: answerPictureId }).exec();
        });
    }
    getAnswerPictures(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.AnswerPictureModel.find().exec()).length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const answerPictures = yield this.AnswerPictureModel.find()
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .exec();
            delete pagingParams.offset;
            return {
                answerPictures: answerPictures,
                paging: pagingParams,
            };
        });
    }
    getAnswerPicturesOfUser(paging, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.AnswerPictureModel.find({ owner: userId }).exec())
                .length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const answerPictures = yield this.AnswerPictureModel.find({ owner: userId })
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .exec();
            delete pagingParams.offset;
            return {
                answerPictures: answerPictures,
                paging: pagingParams,
            };
        });
    }
    updateAnswerPictureById(answerPictureId, answerPictureFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerPictureModel.findOneAndUpdate({ _id: answerPictureId }, { $set: answerPictureFields }, { new: true }).exec();
        });
    }
    removeAnswerPictureById(answerPictureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerPictureModel.findOneAndRemove({
                _id: answerPictureId,
            }).exec();
        });
    }
}
exports.default = new AnswerPicturesDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnBpY3R1cmVzLmRhby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Fuc3dlci5waWN0dXJlcy9kYW9zL2Fuc3dlci5waWN0dXJlcy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsK0JBQWdDO0FBQ2hDLHVDQUF1QztBQUN2Qyw4RkFBcUU7QUFDckUsOERBQW1EO0FBSW5ELGtHQUF5RTtBQUV6RSxNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMseUJBQXlCLENBQUMsQ0FBQztBQVc5RCxNQUFNLDBCQUEwQixHQUEyQjtJQUN6RCxJQUFJLEVBQUUsNEJBQTRCO0lBQ2xDLFFBQVEsRUFBRSxFQUFFO0lBQ1osT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFO0lBQ25CLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRTtDQUNuQixDQUFDO0FBRUYsTUFBTSxpQkFBa0IsU0FBUSxlQUFrQjtJQWlCaEQ7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWpCVix3QkFBbUIsR0FBRyxJQUFJLGlCQUFNLENBQzlCO1lBQ0UsR0FBRyxFQUFFLE1BQU07WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQztZQUNsQyxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxJQUFJO1NBQ2IsRUFDRCxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FDOUQsQ0FBQztRQUVGLHVCQUFrQixHQUFHLDBCQUFlO2FBQ2pDLFdBQVcsRUFBRTthQUNiLEtBQUssQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFLbEQsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUNqQyxDQUFDO0lBRUssZ0JBQWdCLENBQUMsbUJBQTJDOztZQUNoRSxNQUFNLGVBQWUsR0FBRyxJQUFBLFNBQUksR0FBRSxDQUFDO1lBQy9CLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLGtCQUFrQiwrQkFDL0MsR0FBRyxFQUFFLGVBQWUsSUFDakIsMEJBQTBCLEdBQzFCLG1CQUFtQixFQUN0QixDQUFDO1lBRUgsTUFBTSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFM0IsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQztLQUFBO0lBRUssb0JBQW9CLENBQUMsZUFBdUI7O1lBQ2hELE9BQU8sTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUUsQ0FBQztLQUFBO0lBRUssaUJBQWlCLENBQUMsTUFBMkI7O1lBQ2pELE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDbkUsTUFBTSxZQUFZLEdBQWlCLDJCQUFnQixDQUFDLGVBQWUsQ0FDakUsTUFBTSxFQUNOLEtBQUssQ0FDTixDQUFDO1lBRUYsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO2lCQUN4RCxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztpQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO2lCQUM5QixJQUFJLEVBQUUsQ0FBQztZQUVWLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUUzQixPQUFPO2dCQUNMLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixNQUFNLEVBQUUsWUFBWTthQUNyQixDQUFDO1FBQ0osQ0FBQztLQUFBO0lBRUssdUJBQXVCLENBQUMsTUFBMkIsRUFBRSxNQUFjOztZQUN2RSxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUN2RSxNQUFNLENBQUM7WUFDVixNQUFNLFlBQVksR0FBaUIsMkJBQWdCLENBQUMsZUFBZSxDQUNqRSxNQUFNLEVBQ04sS0FBSyxDQUNOLENBQUM7WUFFRixNQUFNLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7aUJBQ3ZFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO2lCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7aUJBQzlCLElBQUksRUFBRSxDQUFDO1lBRVYsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBRTNCLE9BQU87Z0JBQ0wsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLE1BQU0sRUFBRSxZQUFZO2FBQ3JCLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFSyx1QkFBdUIsQ0FDM0IsZUFBdUIsRUFDdkIsbUJBQWdFOztZQUVoRSxPQUFPLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUNuRCxFQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUMsRUFDdEIsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUMsRUFDM0IsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQ1osQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVLLHVCQUF1QixDQUFDLGVBQXVCOztZQUNuRCxPQUFPLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDO2dCQUNwRCxHQUFHLEVBQUUsZUFBZTthQUNyQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksaUJBQWlCLEVBQUUsQ0FBQyJ9