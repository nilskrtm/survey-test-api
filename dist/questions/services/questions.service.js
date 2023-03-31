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
const questions_dao_1 = __importDefault(require("../daos/questions.dao"));
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
class QuestionsService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield questions_dao_1.default.addQuestion(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield questions_dao_1.default.removeQuestionById(id, true);
        });
    }
    list(paging, surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(paging);
            return yield questions_dao_1.default.getQuestionsOfSurvey(surveyId);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield questions_dao_1.default.updateQuestionById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield questions_dao_1.default.getQuestionById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield questions_dao_1.default.updateQuestionById(id, resource);
        });
    }
}
exports.default = new QuestionsService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25zLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9xdWVzdGlvbnMvc2VydmljZXMvcXVlc3Rpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRUFBaUQ7QUFLakQsa0dBQXlFO0FBRXpFLE1BQU0sZ0JBQWdCO0lBQ2QsTUFBTSxDQUFDLFFBQTJCOztZQUN0QyxPQUFPLE1BQU0sdUJBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLEVBQVU7O1lBQ3pCLE9BQU8sTUFBTSx1QkFBWSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsTUFBMkIsRUFBRSxRQUFnQjs7WUFDdEQsMkJBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXJDLE9BQU8sTUFBTSx1QkFBWSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxFQUFVLEVBQUUsUUFBMEI7O1lBQ3BELE9BQU8sTUFBTSx1QkFBWSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsRUFBVTs7WUFDdEIsT0FBTyxNQUFNLHVCQUFZLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxFQUFVLEVBQUUsUUFBd0I7O1lBQ2hELE9BQU8sTUFBTSx1QkFBWSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyJ9