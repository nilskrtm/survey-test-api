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
const questions_dao_1 = __importDefault(require("../../questions/daos/questions.dao"));
const log = (0, debug_1.default)('app:answer-options-dao');
const defaultAnswerOptionValues = {
    color: '',
    picture: '',
};
class AnswerOptionsDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.answerOptionSchema = new mongoose_1.Schema({
            _id: String,
            order: Number,
            color: String,
            picture: { type: String, ref: 'AnswerPicture' },
        }, { id: false, collection: 'answer_options', versionKey: false });
        this.AnswerOptionModel = mongoose_service_1.default
            .getMongoose()
            .model('AnswerOption', this.answerOptionSchema);
        log('Created new instance of AnswerOptionsDao');
    }
    getModel() {
        return this.AnswerOptionModel;
    }
    addAnswerOption(answerOptionFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerOptionId = (0, uuid_1.v4)();
            const answerOption = new this.AnswerOptionModel(Object.assign(Object.assign({ _id: answerOptionId }, defaultAnswerOptionValues), answerOptionFields));
            yield answerOption.save();
            return answerOptionId;
        });
    }
    getAnswerOptionById(answerOptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerOptionModel.findOne({ _id: answerOptionId })
                .populate({
                path: 'picture',
            })
                .exec();
        });
    }
    /*
    async getAnswerOptions(paging: RequestPagingParams) {
      const count = (await this.AnswerOptionModel.find().exec()).length;
      const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
        paging,
        count,
      );
  
      const answerOptions = await this.AnswerOptionModel.find()
        .limit(pagingParams.perPage)
        .skip(pagingParams.offset || 0)
        .populate({
          path: 'picture',
        })
        .exec();
  
      delete pagingParams.offset;
  
      return {
        answerOptions: answerOptions,
        paging: pagingParams,
      };
    }
    */
    getAnswerOptionsOfQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield questions_dao_1.default.getQuestionById(questionId);
            if (!question) {
                return {
                    answerOptions: [],
                };
            }
            return {
                answerOptions: question.answerOptions,
            };
        });
    }
    updateAnswerOptionById(answerOptionId, answerOptionFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerOptionModel.findOneAndUpdate({ _id: answerOptionId }, { $set: answerOptionFields }, { new: true }).exec();
        });
    }
    removeAnswerOptionById(answerOptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.AnswerOptionModel.findOneAndRemove({
                _id: answerOptionId,
            }).exec();
        });
    }
}
exports.default = new AnswerOptionsDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLm9wdGlvbnMuZGFvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYW5zd2VyLm9wdGlvbnMvZGFvcy9hbnN3ZXIub3B0aW9ucy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsK0JBQWdDO0FBQ2hDLHVDQUF1QztBQUN2Qyw4RkFBcUU7QUFDckUsOERBQW1EO0FBSW5ELHVGQUE4RDtBQUU5RCxNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsd0JBQXdCLENBQUMsQ0FBQztBQVM3RCxNQUFNLHlCQUF5QixHQUEwQjtJQUN2RCxLQUFLLEVBQUUsRUFBRTtJQUNULE9BQU8sRUFBRSxFQUFFO0NBQ1osQ0FBQztBQUVGLE1BQU0sZ0JBQWlCLFNBQVEsZUFBaUI7SUFlOUM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWZWLHVCQUFrQixHQUFHLElBQUksaUJBQU0sQ0FDN0I7WUFDRSxHQUFHLEVBQUUsTUFBTTtZQUNYLEtBQUssRUFBRSxNQUFNO1lBQ2IsS0FBSyxFQUFFLE1BQU07WUFDYixPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUM7U0FDOUMsRUFDRCxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FDN0QsQ0FBQztRQUVGLHNCQUFpQixHQUFHLDBCQUFlO2FBQ2hDLFdBQVcsRUFBRTthQUNiLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFLaEQsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRUssZUFBZSxDQUFDLGtCQUF5Qzs7WUFDN0QsTUFBTSxjQUFjLEdBQUcsSUFBQSxTQUFJLEdBQUUsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsK0JBQzdDLEdBQUcsRUFBRSxjQUFjLElBQ2hCLHlCQUF5QixHQUN6QixrQkFBa0IsRUFDckIsQ0FBQztZQUVILE1BQU0sWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBRTFCLE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUM7S0FBQTtJQUVLLG1CQUFtQixDQUFDLGNBQXNCOztZQUM5QyxPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUMsQ0FBQztpQkFDL0QsUUFBUSxDQUFDO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2hCLENBQUM7aUJBQ0QsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDO0tBQUE7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF1QkU7SUFFSSwwQkFBMEIsQ0FBQyxVQUFrQjs7WUFDakQsTUFBTSxRQUFRLEdBQUcsTUFBTSx1QkFBWSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVoRSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE9BQU87b0JBQ0wsYUFBYSxFQUFFLEVBQUU7aUJBQ2xCLENBQUM7YUFDSDtZQUVELE9BQU87Z0JBQ0wsYUFBYSxFQUFFLFFBQVEsQ0FBQyxhQUFhO2FBQ3RDLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFSyxzQkFBc0IsQ0FDMUIsY0FBc0IsRUFDdEIsa0JBQTZEOztZQUU3RCxPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUNsRCxFQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUMsRUFDckIsRUFBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUMsRUFDMUIsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQ1osQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVLLHNCQUFzQixDQUFDLGNBQXNCOztZQUNqRCxPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUNuRCxHQUFHLEVBQUUsY0FBYzthQUNwQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyJ9