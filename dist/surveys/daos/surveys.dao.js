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
const questions_dao_1 = __importDefault(require("../../questions/daos/questions.dao"));
const votings_dao_1 = __importDefault(require("../../votings/daos/votings.dao"));
const log = (0, debug_1.default)('app:surveys-dao');
const defaultSurveyValues = {
    name: 'Neue Umfrage',
    description: 'Noch keine Beschreibung',
    greeting: 'Noch keine Begrüßung',
    startDate: new Date(),
    endDate: new Date(),
    created: new Date(),
    edited: new Date(),
    draft: true,
    archived: false,
    questions: [],
};
class SurveysDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.surveySchema = new mongoose_1.Schema({
            _id: String,
            name: String,
            description: String,
            greeting: String,
            startDate: Date,
            endDate: Date,
            owner: { type: String, ref: 'User' },
            created: Date,
            edited: Date,
            draft: Boolean,
            archived: Boolean,
            questions: [{ type: String, ref: 'Question' }],
        }, { id: false, collection: 'surveys', versionKey: false }).pre('findOneAndRemove', function (next) {
            return __awaiter(this, void 0, void 0, function* () {
                // cascade-handler
                if (!dao_class_1.DAO.isCascadeRemoval(this)) {
                    next();
                }
                const survey = yield this.model.findOne(this.getQuery()).exec();
                const promises = survey.questions.map(questionId => questions_dao_1.default.removeQuestionById(questionId, true));
                promises.push(votings_dao_1.default.removeVotingsOfSurvey(survey._id));
                yield Promise.all(promises);
                next();
            });
        });
        this.SurveyModel = mongoose_service_1.default
            .getMongoose()
            .model('Survey', this.surveySchema);
        log('Created new instance of SurveysDao');
    }
    getModel() {
        return this.SurveyModel;
    }
    addSurvey(surveyFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const surveyId = (0, uuid_1.v4)();
            const survey = new this.SurveyModel(Object.assign(Object.assign({ _id: surveyId }, defaultSurveyValues), surveyFields));
            yield survey.save();
            return surveyId;
        });
    }
    getSurveyById(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.SurveyModel.findOne({ _id: surveyId })
                .populate({
                path: 'questions',
                populate: {
                    path: 'answerOptions',
                    populate: {
                        path: 'picture',
                    },
                },
            })
                .exec();
        });
    }
    getSurveys(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.SurveyModel.find().exec()).length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const surveys = yield this.SurveyModel.find()
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .populate({
                path: 'questions',
                populate: {
                    path: 'answerOptions',
                    populate: {
                        path: 'picture',
                    },
                },
            })
                .exec();
            delete pagingParams.offset;
            return {
                surveys: surveys,
                paging: pagingParams,
            };
        });
    }
    getSurveysOfOwner(paging, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = (yield this.SurveyModel.find({ owner: owner }).exec()).length;
            const pagingParams = paging_middleware_1.default.calculatePaging(paging, count);
            const surveys = yield this.SurveyModel.find({ owner: owner })
                .limit(pagingParams.perPage)
                .skip(pagingParams.offset || 0)
                .populate({
                path: 'questions',
                populate: {
                    path: 'answerOptions',
                    populate: {
                        path: 'picture',
                    },
                },
            })
                .exec();
            delete pagingParams.offset;
            return {
                surveys: surveys,
                paging: pagingParams,
            };
        });
    }
    updateSurveyById(surveyId, surveyFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.SurveyModel.findOneAndUpdate({ _id: surveyId }, { $set: surveyFields }, { new: true }).exec();
        });
    }
    removeSurveyById(surveyId, cascade) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.SurveyModel.findOneAndRemove({ _id: surveyId })
                .setOptions({
                comment: {
                    cascade: cascade ? cascade : false,
                },
            })
                .exec();
        });
    }
}
exports.default = new SurveysDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VydmV5cy5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zdXJ2ZXlzL2Rhb3Mvc3VydmV5cy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsK0JBQWdDO0FBQ2hDLHVDQUF1QztBQUN2Qyw4RkFBcUU7QUFJckUsa0dBQXlFO0FBQ3pFLDhEQUFtRDtBQUNuRCx1RkFBOEQ7QUFDOUQsaUZBQXdEO0FBRXhELE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBaUJ0RCxNQUFNLG1CQUFtQixHQUFvQjtJQUMzQyxJQUFJLEVBQUUsY0FBYztJQUNwQixXQUFXLEVBQUUseUJBQXlCO0lBQ3RDLFFBQVEsRUFBRSxzQkFBc0I7SUFDaEMsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO0lBQ3JCLE9BQU8sRUFBRSxJQUFJLElBQUksRUFBRTtJQUNuQixPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUU7SUFDbkIsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFO0lBQ2xCLEtBQUssRUFBRSxJQUFJO0lBQ1gsUUFBUSxFQUFFLEtBQUs7SUFDZixTQUFTLEVBQUUsRUFBRTtDQUNkLENBQUM7QUFFRixNQUFNLFVBQVcsU0FBUSxlQUFXO0lBdUNsQztRQUNFLEtBQUssRUFBRSxDQUFDO1FBdkNWLGlCQUFZLEdBQUcsSUFBSSxpQkFBTSxDQUN2QjtZQUNFLEdBQUcsRUFBRSxNQUFNO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixXQUFXLEVBQUUsTUFBTTtZQUNuQixRQUFRLEVBQUUsTUFBTTtZQUNoQixTQUFTLEVBQUUsSUFBSTtZQUNmLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFDO1lBQ2xDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixL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