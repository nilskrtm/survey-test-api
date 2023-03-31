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
const answer_options_dao_1 = __importDefault(require("../daos/answer.options.dao"));
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
class AnswerOptionsService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_options_dao_1.default.addAnswerOption(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_options_dao_1.default.removeAnswerOptionById(id);
        });
    }
    list(paging, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(paging);
            return yield answer_options_dao_1.default.getAnswerOptionsOfQuestion(questionId);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_options_dao_1.default.updateAnswerOptionById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_options_dao_1.default.getAnswerOptionById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_options_dao_1.default.updateAnswerOptionById(id, resource);
        });
    }
}
exports.default = new AnswerOptionsService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLm9wdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Fuc3dlci5vcHRpb25zL3NlcnZpY2VzL2Fuc3dlci5vcHRpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRkFBMEQ7QUFLMUQsa0dBQXlFO0FBRXpFLE1BQU0sb0JBQW9CO0lBQ2xCLE1BQU0sQ0FBQyxRQUErQjs7WUFDMUMsT0FBTyxNQUFNLDRCQUFnQixDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUMsRUFBVTs7WUFDekIsT0FBTyxNQUFNLDRCQUFnQixDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUVLLElBQUksQ0FBQyxNQUEyQixFQUFFLFVBQWtCOztZQUN4RCwyQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFckMsT0FBTyxNQUFNLDRCQUFnQixDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxFQUFVLEVBQUUsUUFBOEI7O1lBQ3hELE9BQU8sTUFBTSw0QkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckUsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEVBQVU7O1lBQ3RCLE9BQU8sTUFBTSw0QkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsRUFBVSxFQUFFLFFBQTRCOztZQUNwRCxPQUFPLE1BQU0sNEJBQWdCLENBQUMsc0JBQXNCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxvQkFBb0IsRUFBRSxDQUFDIn0=