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
const surveys_service_1 = __importDefault(require("../../surveys/services/surveys.service"));
const log = (0, debug_1.default)('app:surveys-controller');
class SurveysController {
    listSurveys(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const surveys = yield surveys_service_1.default.list(req.body.paging, ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId));
            res.status(200).send(surveys);
        });
    }
    getSurveyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = yield surveys_service_1.default.getById(req.body.locals.surveyId);
            res.status(200).send({ survey: survey });
        });
    }
    createSurvey(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const surveyId = yield surveys_service_1.default.create(Object.assign(Object.assign({}, req.body), { owner: ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId) }));
            log(`created new survey ${surveyId}`);
            res.status(201).send({ id: surveyId });
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield surveys_service_1.default.patchById(req.body.locals.surveyId, req.body);
            log(`updated survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield surveys_service_1.default.putById(req.body.locals.surveyId, req.body);
            log(`updated survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
    removeSurvey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield surveys_service_1.default.deleteById(req.body.locals.surveyId);
            log(`deleted survey ${req.body.locals.surveyId}`);
            res.status(204).send();
        });
    }
}
exports.default = new SurveysController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VydmV5cy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3VydmV5cy9jb250cm9sbGVycy9zdXJ2ZXlzLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsNkZBQW9FO0FBRXBFLE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBRTdELE1BQU0saUJBQWlCO0lBQ2YsV0FBVyxDQUFDLEdBQVksRUFBRSxHQUFhOzs7WUFDM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSx5QkFBYyxDQUFDLElBQUksQ0FDdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQ2YsQ0FBQSxNQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRywwQ0FBRSxNQUFNLE1BQUksTUFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsMENBQUUsTUFBTSxDQUFBLENBQ3ZELENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7S0FDL0I7SUFFSyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0seUJBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFdEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDO0tBQUE7SUFFSyxZQUFZLENBQUMsR0FBWSxFQUFFLEdBQWE7OztZQUM1QyxNQUFNLFFBQVEsR0FBRyxNQUFNLHlCQUFjLENBQUMsTUFBTSxpQ0FDdkMsR0FBRyxDQUFDLElBQUksS0FDWCxLQUFLLEVBQUUsQ0FBQSxNQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRywwQ0FBRSxNQUFNLE1BQUksTUFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsMENBQUUsTUFBTSxDQUFBLElBQzdELENBQUM7WUFFSCxHQUFHLENBQUMsc0JBQXNCLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQzs7S0FDdEM7SUFFSyxLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ3JDLE1BQU0seUJBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuRSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFSyxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ25DLE1BQU0seUJBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqRSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFbEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFSyxZQUFZLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQzVDLE1BQU0seUJBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFMUQsR0FBRyxDQUFDLGtCQUFrQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRWxELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLGlCQUFpQixFQUFFLENBQUMifQ==