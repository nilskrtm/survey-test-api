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
const surveys_dao_1 = __importDefault(require("../../surveys/daos/surveys.dao"));
const answer_options_dao_1 = __importDefault(require("../../answer.options/daos/answer.options.dao"));
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
const log = (0, debug_1.default)('app:questions-dao');
const defaultQuestionValues = {
    question: 'Frage noch nicht festgelegt',
    timeout: 30,
    answerOptions: [],
};
class QuestionsDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.questionSchema = new mongoose_1.Schema({
            _id: String,
            question: String,
            timeout: Number,
            order: Number,
            answerOptions: [{ type: String, ref: 'AnswerOption' }],
        }, { id: false, collection: 'questions', versionKey: false }).pre('findOneAndRemove', function (next) {
            return __awaiter(this, void 0, void 0, function* () {
                // cascade-handler
                if (!dao_class_1.DAO.isCascadeRemoval(this)) {
                    next();
                }
                const question = yield this.model.findOne(this.getQuery()).exec();
                const promises = question.answerOptions.map(answerOptionId => answer_options_dao_1.default.removeAnswerOptionById(answerOptionId));
                yield Promise.all(promises);
                next();
            });
        });
        this.QuestionModel = mongoose_service_1.default
            .getMongoose()
            .model('Question', this.questionSchema);
        log('Created new instance of QuestionsDao');
    }
    getModel() {
        return this.QuestionModel;
    }
    addQuestion(questionFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionId = (0, uuid_1.v4)();
            const question = new this.QuestionModel(Object.assign(Object.assign({ _id: questionId }, defaultQuestionValues), questionFields));
            yield question.save();
            return questionId;
        });
    }
    getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.QuestionModel.findOne({ _id: questionId })
                .populate({
                path: 'answerOptions',
                populate: {
                    path: 'picture',
                },
            })
                .exec();
        });
    }
    getQuestions(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.QuestionModel.find().exec()).length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const questions = yield this.QuestionModel.find()
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .populate({
                path: 'answerOptions',
                populate: {
                    path: 'picture',
                },
            })
                .exec();
            delete pagingParams.offset;
            return {
                questions: questions,
                paging: pagingParams,
            };
        });
    }
    getQuestionsOfSurvey(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = yield surveys_dao_1.default.getSurveyById(surveyId);
            if (!survey) {
                return {
                    questions: [],
                };
            }
            return {
                questions: survey.questions,
            };
        });
    }
    updateQuestionById(questionId, questionFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.QuestionModel.findOneAndUpdate({ _id: questionId }, { $set: questionFields }, { new: true }).exec();
        });
    }
    removeQuestionById(questionId, cascade) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.QuestionModel.findOneAndRemove({ _id: questionId })
                .setOptions({
                comment: {
                    cascade: cascade ? cascade : false,
                },
            })
                .exec();
        });
    }
}
exports.default = new QuestionsDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25zLmRhby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3F1ZXN0aW9ucy9kYW9zL3F1ZXN0aW9ucy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsK0JBQWdDO0FBQ2hDLHVDQUFnQztBQUNoQyw4RkFBcUU7QUFJckUsOERBQW1EO0FBQ25ELGlGQUF3RDtBQUN4RCxzR0FBNEU7QUFDNUUsa0dBQXlFO0FBRXpFLE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBVXhELE1BQU0scUJBQXFCLEdBQXNCO0lBQy9DLFFBQVEsRUFBRSw2QkFBNkI7SUFDdkMsT0FBTyxFQUFFLEVBQUU7SUFDWCxhQUFhLEVBQUUsRUFBRTtDQUNsQixDQUFDO0FBRUYsTUFBTSxZQUFhLFNBQVEsZUFBYTtJQTZCdEM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQTdCVixtQkFBYyxHQUFHLElBQUksaUJBQU0sQ0FDekI7WUFDRSxHQUFHLEVBQUUsTUFBTTtZQUNYLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsS0FBSyxFQUFFLE1BQU07WUFDYixhQUFhLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBQyxDQUFDO1NBQ3JELEVBQ0QsRUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUN4RCxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxVQUFzQixJQUFJOztnQkFDbEQsa0JBQWtCO2dCQUNsQixJQUFJLENBQUMsZUFBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMvQixJQUFJLEVBQUUsQ0FBQztpQkFDUjtnQkFFRCxNQUFNLFFBQVEsR0FBYSxNQUFNLElBQUksQ0FBQyxLQUFLLENB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