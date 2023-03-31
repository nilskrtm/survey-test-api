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
const votings_service_1 = __importDefault(require("../services/votings.service"));
const log = (0, debug_1.default)('app:votings-controller');
class VotingsController {
    createVoting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const survey = res.locals.survey;
            const votingId = yield votings_service_1.default.create(Object.assign(Object.assign({}, req.body), { survey: survey._id }));
            log(`created new voting ${votingId} for survey ${req.body.locals.surveyId}`);
            res.status(201).send({ id: votingId });
        });
    }
}
exports.default = new VotingsController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90aW5ncy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdm90aW5ncy9jb250cm9sbGVycy92b3RpbmdzLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFHMUIsa0ZBQXlEO0FBRXpELE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBRTdELE1BQU0saUJBQWlCO0lBQ2YsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUM1QyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLHlCQUFjLENBQUMsTUFBTSxpQ0FDdkMsR0FBRyxDQUFDLElBQUksS0FDWCxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFDbEIsQ0FBQztZQUVILEdBQUcsQ0FDRCxzQkFBc0IsUUFBUSxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUN4RSxDQUFDO1lBRUYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksaUJBQWlCLEVBQUUsQ0FBQyJ9