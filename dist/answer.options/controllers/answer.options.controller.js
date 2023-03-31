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
const questions_service_1 = __importDefault(require("../../questions/services/questions.service"));
const surveys_service_1 = __importDefault(require("../../surveys/services/surveys.service"));
const answer_options_service_1 = __importDefault(require("../services/answer.options.service"));
const log = (0, debug_1.default)('app:answer-options-controller');
class AnswerOptionsController {
    listAnswerOptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerOptions = yield answer_options_service_1.default.list(req.body.paging, req.body.locals.questionId);
            res.status(200).send(answerOptions);
        });
    }
    getAnswerOptionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerOption = yield answer_options_service_1.default.getById(req.body.locals.answerOptionId);
            res.status(200).send({ answerOption: answerOption });
        });
    }
    createAnswerOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = res.locals.question;
            const answerOptionId = yield answer_options_service_1.default.create(Object.assign(Object.assign({}, req.body), { order: question.answerOptions.length + 1 }));
            const answerOptionIds = question.answerOptions.map(answerOptionObject => answerOptionObject._id);
            if (!answerOptionIds.includes(answerOptionId)) {
                answerOptionIds.push(answerOptionId);
            }
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            const patchQuestion = questions_service_1.default.patchById(question._id, {
                answerOptions: answerOptionIds,
            });
            yield Promise.all([patchQuestion, patchSurvey]);
            log(`created new answer-option ${answerOptionId} for question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(201).send({ id: answerOptionId });
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const patchAnswerOption = answer_options_service_1.default.patchById(req.body.locals.answerOptionId, req.body);
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            yield Promise.all([patchAnswerOption, patchSurvey]);
            log(`updated answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const patchAnswerOption = answer_options_service_1.default.putById(req.body.locals.answerOptionId, req.body);
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            yield Promise.all([patchAnswerOption, patchSurvey]);
            log(`updated answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    removeAnswerOption(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = res.locals.question;
            const answerOptionIds = question.answerOptions
                .map(answerOptionObject => {
                if (answerOptionObject._id !== req.body.locals.answerOptionId) {
                    return answerOptionObject._id;
                }
            })
                .filter(answerOptionId => answerOptionId);
            const newSorting = {};
            answerOptionIds.map((answerOptionId, index) => {
                newSorting[answerOptionId] = index + 1;
            });
            const deleteAnswerOption = answer_options_service_1.default.deleteById(req.body.locals.answerOptionId);
            const patchQuestion = questions_service_1.default.patchById(req.body.locals.questionId, {
                answerOptions: answerOptionIds,
            });
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            const patchAnswerOptions = [];
            Object.keys(newSorting).forEach(answerOptionId => {
                patchAnswerOptions.push(answer_options_service_1.default.patchById(answerOptionId, {
                    order: newSorting[answerOptionId],
                }));
            });
            yield Promise.all([
                ...[deleteAnswerOption, patchQuestion, patchSurvey],
                ...patchAnswerOptions,
            ]);
            log(`deleted answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    reorderAnswerOptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = res.locals.question;
            const newSorting = req.body.ordering;
            const patchAnswerOptions = [];
            const answerOptionIds = Array(question.answerOptions.length).fill('');
            Object.keys(newSorting).forEach(answerOptionId => {
                answerOptionIds[newSorting[answerOptionId] - 1] = answerOptionId;
                patchAnswerOptions.push(answer_options_service_1.default.patchById(answerOptionId, {
                    order: newSorting[answerOptionId],
                }));
            });
            const patchQuestion = questions_service_1.default.patchById(req.body.locals.questionId, {
                answerOptions: answerOptionIds,
            });
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            yield Promise.all([...[patchQuestion, patchSurvey], ...patchAnswerOptions]);
            log(`reordered answer-options of question ${req.body.local.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
}
exports.default = new AnswerOptionsController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLm9wdGlvbnMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Fuc3dlci5vcHRpb25zL2NvbnRyb2xsZXJzL2Fuc3dlci5vcHRpb25zLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsbUdBQTBFO0FBQzFFLDZGQUFvRTtBQUVwRSxnR0FBc0U7QUFFdEUsTUFBTSxHQUFHLEdBQW9CLElBQUEsZUFBSyxFQUFDLCtCQUErQixDQUFDLENBQUM7QUFFcEUsTUFBTSx1QkFBdUI7SUFDckIsaUJBQWlCLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ2pELE1BQU0sYUFBYSxHQUFHLE1BQU0sZ0NBQW9CLENBQUMsSUFBSSxDQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQzNCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFSyxtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7WUFDbkQsTUFBTSxZQUFZLEdBQUcsTUFBTSxnQ0FBb0IsQ0FBQyxPQUFPLENBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDL0IsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0lBRUssa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ2xELE1BQU0sUUFBUSxHQUFhLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLE1BQU0sY0FBYyxHQUFHLE1BQU0sZ0NBQW9CLENBQUMsTUFB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