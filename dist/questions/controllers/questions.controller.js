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
const log = (0, debug_1.default)('app:questions-controller');
class QuestionsController {
    listQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield questions_service_1.default.list(req.body.paging, req.body.locals.surveyId);
            res.status(200).send(questions);
        });
    }
    getQuestionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield questions_service_1.default.getById(req.body.locals.questionId);
            res.status(200).send({ question: question });
        });
    }
    createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = res.locals.survey;
            const questionId = yield questions_service_1.default.create(Object.assign(Object.assign({}, req.body), { order: survey.questions.length + 1 }));
            const questionIds = survey.questions.map(questionObject => questionObject._id);
            if (!questionIds.includes(questionId)) {
                questionIds.push(questionId);
            }
            yield surveys_service_1.default.patchById(survey._id, {
                questions: questionIds,
                edited: new Date(),
            });
            log(`created new question ${questionId} for survey ${req.body.locals.surveyId}`);
            res.status(201).send({ id: questionId });
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const patchQuestion = questions_service_1.default.patchById(req.body.locals.questionId, req.body);
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            yield Promise.all([patchQuestion, patchSurvey]);
            log(`updated question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const patchQuestion = questions_service_1.default.putById(req.body.locals.questionId, req.body);
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
            });
            yield Promise.all([patchQuestion, patchSurvey]);
            log(`updated question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    removeQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = res.locals.survey;
            const questionIds = survey.questions
                .map(questionObject => {
                if (questionObject._id !== req.body.locals.questionId) {
                    return questionObject._id;
                }
            })
                .filter(questionId => questionId);
            const newSorting = {};
            questionIds.map((questionId, index) => {
                newSorting[questionId] = index + 1;
            });
            const deleteQuestion = questions_service_1.default.deleteById(req.body.locals.questionId);
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
                questions: questionIds,
            });
            const patchQuestions = [];
            Object.keys(newSorting).forEach(questionId => {
                patchQuestions.push(questions_service_1.default.patchById(questionId, { order: newSorting[questionId] }));
            });
            yield Promise.all([...[deleteQuestion, patchSurvey], ...patchQuestions]);
            log(`deleted question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    reorderQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = res.locals.survey;
            const newSorting = req.body.ordering;
            const patchQuestions = [];
            const questionIds = Array(survey.questions.length).fill('');
            console.log(survey.questions.length);
            console.log(questionIds.length);
            Object.keys(newSorting).forEach(questionId => {
                questionIds[newSorting[questionId] - 1] = questionId;
                patchQuestions.push(questions_service_1.default.patchById(questionId, { order: newSorting[questionId] }));
            });
            const patchSurvey = surveys_service_1.default.patchById(req.body.locals.surveyId, {
                edited: new Date(),
                questions: questionIds,
            });
            yield Promise.all([...[patchSurvey], ...patchQuestions]);
            log(`reordered questions of survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
}
exports.default = new QuestionsController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25zLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9xdWVzdGlvbnMvY29udHJvbGxlcnMvcXVlc3Rpb25zLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsbUdBQTBFO0FBQzFFLDZGQUFvRTtBQUdwRSxNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUUvRCxNQUFNLG1CQUFtQjtJQUNqQixhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQzdDLE1BQU0sU0FBUyxHQUFHLE1BQU0sMkJBQWdCLENBQUMsSUFBSSxDQUMzQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQ3pCLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFFSyxlQUFlLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQy9DLE1BQU0sUUFBUSxHQUFHLE1BQU0sMkJBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTVFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztLQUFBO0lBRUssY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUM5QyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLDJCQUFnQixDQUFDLE1BQU0saUNBQzNDLEdBQUcsQ0FBQyxJQUFJLEtBQ1gsS0FBSyxF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