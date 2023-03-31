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
const surveys_service_1 = __importDefault(require("../services/surveys.service"));
//const log: debug.IDebugger = debug('app:surveys-controllers');
class SurveyMiddleware {
    validateSetStartEndDates(req, res, next) {
        const survey = res.locals.survey;
        const surveyStartDate = new Date(survey.startDate).getTime();
        const surveyEndDate = new Date(survey.endDate).getTime();
        const currentDate = new Date().getTime();
        let startDateToSet = req.body.startDate;
        let endDateToSet = req.body.endDate;
        if (startDateToSet && !endDateToSet) {
            startDateToSet = new Date(startDateToSet).getTime();
            if (startDateToSet >= surveyEndDate) {
                return res.status(400).send({
                    error: `Das Startdatum muss vor dem Enddatum der Umfrage liegen.`,
                });
            }
        }
        else if (!startDateToSet && endDateToSet) {
            endDateToSet = new Date(endDateToSet).getTime();
            if (endDateToSet <= surveyStartDate) {
                return res.status(400).send({
                    error: `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
                });
            }
            if (endDateToSet <= currentDate) {
                return res.status(400).send({
                    error: `Das Enddatum der Umfrage muss in der Zukunft liegen.`,
                });
            }
        }
        else if (startDateToSet && endDateToSet) {
            startDateToSet = new Date(startDateToSet).getTime();
            endDateToSet = new Date(endDateToSet).getTime();
            if (endDateToSet <= currentDate) {
                return res.status(400).send({
                    error: `Das Enddatum der Umfrage muss in der Zukunft liegen.`,
                });
            }
            if (endDateToSet <= startDateToSet) {
                return res.status(400).send({
                    error: `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
                });
            }
        }
        next();
    }
    validateSurveyIsNoDraft(req, res, next) {
        const survey = res.locals.survey;
        if (!survey.draft) {
            next();
        }
        else {
            res.status(400).send({
                error: `Survey ${survey._id} is still a draft`,
            });
        }
    }
    validateSurveyIsDraft(req, res, next) {
        const survey = res.locals.survey;
        if (survey.draft) {
            next();
        }
        else {
            res.status(400).send({
                error: `Survey ${survey._id} is not a draft`,
            });
        }
    }
    validateSurveyModifiable(req, res, next) {
        const survey = res.locals.survey;
        if (!survey.draft) {
            if (!('name' in req.body) &&
                !('description' in req.body) &&
                !('greeting' in req.body)) {
                return next();
            }
            else {
                res.status(400).send({
                    error: `Survey ${survey._id} is not a draft`,
                });
            }
        }
        else {
            next();
        }
    }
    validateSurveyFinalizable(req, res, next) {
        if ('draft' in req.body && req.body.draft === false) {
            const survey = res.locals.survey;
            const surveyStartDate = new Date(survey.startDate).getTime();
            const surveyEndDate = new Date(survey.endDate).getTime();
            const currentDate = new Date().getTime();
            if (surveyStartDate < surveyEndDate &&
                surveyEndDate > currentDate &&
                survey.questions.length > 0) {
                const allQuestionsValid = survey.questions.every(questionObject => {
                    return (questionObject.question.length > 0 &&
                        questionObject.timeout >= 0 &&
                        questionObject.order > 0 &&
                        questionObject.answerOptions.length > 0);
                });
                const questionsOrderValid = survey.questions.reduce((accumulator, questionObject) => accumulator + questionObject.order, 0) ==
                    Array.from(Array(survey.questions.length + 1).keys()).reduce((accumulator, value) => accumulator + value, 0);
                if (allQuestionsValid && questionsOrderValid) {
                    let allQuestionsAnswerOptionsValid = true;
                    let answerOptionsOrderValid = true;
                    for (let questionObject of survey.questions) {
                        if (!questionObject.answerOptions.every((answerOptionObject) => {
                            return (answerOptionObject.picture &&
                                answerOptionObject.color &&
                                answerOptionObject.order > 0);
                        })) {
                            allQuestionsAnswerOptionsValid = false;
                            break;
                        }
                        if (questionObject.answerOptions.reduce((accumulator, answerOptionObject) => accumulator + answerOptionObject.order, 0) !==
                            Array.from(Array(questionObject.answerOptions.length + 1).keys()).reduce((accumulator, value) => accumulator + value, 0)) {
                            answerOptionsOrderValid = false;
                            break;
                        }
                    }
                    if (allQuestionsAnswerOptionsValid && answerOptionsOrderValid) {
                        const answerPictureObjects = [];
                        for (let questionObject of survey.questions) {
                            for (let answerOptionObject of questionObject.answerOptions) {
                                answerPictureObjects.push(answerOptionObject.picture);
                            }
                        }
                        const allAnswerPicturesValid = answerPictureObjects.every(answerPictureObject => {
                            return answerPictureObject.name && answerPictureObject.fileName;
                        });
                        if (allAnswerPicturesValid) {
                            return next();
                        }
                    }
                }
            }
            res.status(400).send({
                error: `Survey ${survey._id} is not finalizable`,
            });
        }
        else {
            next();
        }
    }
    validateSurveyExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = yield surveys_service_1.default.getById(req.body.locals.surveyId);
            if (survey) {
                res.locals.survey = survey;
                next();
            }
            else {
                res.status(404).send({
                    error: `Survey ${req.params.surveyId} not found`,
                });
            }
        });
    }
    extractSurveyId(req, res, next) {
        req.body.locals.surveyId = req.params.surveyId;
        next();
    }
}
exports.default = new SurveyMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VydmV5cy5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3VydmV5cy9taWRkbGV3YXJlL3N1cnZleXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLGtGQUF3RDtBQU14RCxnRUFBZ0U7QUFFaEUsTUFBTSxnQkFBZ0I7SUFDcEIsd0JBQXdCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUN0RSxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxNQUFNLGVBQWUsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pELE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekMsSUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEMsSUFBSSxZQUFZLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFcEMsSUFBSSxjQUFjLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkMsY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXBELElBQUksY0FBYyxJQUFJLGFBQWEsRUFBRTtnQkFDbkMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDMUIsS0FBSyxFQUFFLDBEQUEwRDtpQkFDbEUsQ0FBQyxDQUFDO2FBQ0o7U0FDRjthQUFNLElBQUksQ0FBQyxjQUFjLElBQUksWUFBWSxFQUFFO1lBQzFDLFlBQVksR0FBRyxJQUFJ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