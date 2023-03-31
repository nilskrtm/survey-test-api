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
const surveys_dao_1 = __importDefault(require("../daos/surveys.dao"));
class SurveysService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.addSurvey(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.removeSurveyById(id, true);
        });
    }
    list(paging, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.getSurveysOfOwner(paging, ownerId);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.updateSurveyById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.getSurveyById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield surveys_dao_1.default.updateSurveyById(id, resource);
        });
    }
}
exports.default = new SurveysService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VydmV5cy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3VydmV5cy9zZXJ2aWNlcy9zdXJ2ZXlzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBNkM7QUFNN0MsTUFBTSxjQUFjO0lBQ1osTUFBTSxDQUFDLFFBQXlCOztZQUNwQyxPQUFPLE1BQU0scUJBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLEVBQVU7O1lBQ3pCLE9BQU8sTUFBTSxxQkFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsTUFBMkIsRUFBRSxPQUFlOztZQUNyRCxPQUFPLE1BQU0scUJBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0QsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLEVBQVUsRUFBRSxRQUF3Qjs7WUFDbEQsT0FBTyxNQUFNLHFCQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxFQUFVOztZQUN0QixPQUFPLE1BQU0scUJBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEVBQVUsRUFBRSxRQUFzQjs7WUFDOUMsT0FBTyxNQUFNLHFCQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxjQUFjLEVBQUUsQ0FBQyJ9