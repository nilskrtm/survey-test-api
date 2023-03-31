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
const votings_dao_1 = __importDefault(require("../../votings/daos/votings.dao"));
const paging_middleware_1 = __importDefault(require("../../common/middleware/paging.middleware"));
class VotingsService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield votings_dao_1.default.addVoting(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(id);
            throw new Error('should not be used');
            //return await VotingsDAO.removeSurveyById(id, true);
        });
    }
    list(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(paging);
            throw new Error('should not be used');
            //return await VotingsDAO.getSurveysOfOwner(paging, ownerId);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(id);
            paging_middleware_1.default.ignoreValue(resource);
            throw new Error('should not be used');
            //return await VotingsDAO.updateSurveyById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(id);
            throw new Error('should not be used');
            //return await VotingsDAO.getSurveyById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            paging_middleware_1.default.ignoreValue(id);
            paging_middleware_1.default.ignoreValue(resource);
            throw new Error('should not be used');
            //return await VotingsDAO.updateSurveyById(id, resource);
        });
    }
}
exports.default = new VotingsService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90aW5ncy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdm90aW5ncy9zZXJ2aWNlcy92b3RpbmdzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpRkFBd0Q7QUFJeEQsa0dBQXlFO0FBRXpFLE1BQU0sY0FBYztJQUNaLE1BQU0sQ0FBQyxRQUF5Qjs7WUFDcEMsT0FBTyxNQUFNLHFCQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxFQUFVOztZQUN6QiwyQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3RDLHFEQUFxRDtRQUN2RCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsTUFBMkI7O1lBQ3BDLDJCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVyQyxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdEMsNkRBQTZEO1FBQy9ELENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxFQUFVLEVBQUUsUUFBd0I7O1lBQ2xELDJCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQywyQkFBZ0IsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3RDLHlEQUF5RDtRQUMzRCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsRUFBVTs7WUFDdEIsMkJBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRWpDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN0Qyw0Q0FBNEM7UUFDOUMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEVBQVUsRUFBRSxRQUFzQjs7WUFDOUMsMkJBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLDJCQUFnQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV2QyxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDdEMseURBQXlEO1FBQzNELENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxjQUFjLEVBQUUsQ0FBQyJ9