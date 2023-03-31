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
const answer_pictures_dao_1 = __importDefault(require("../daos/answer.pictures.dao"));
class AnswerPicturesService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.addAnswerPicture(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.removeAnswerPictureById(id);
        });
    }
    list(paging, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.getAnswerPicturesOfUser(paging, userId);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.updateAnswerPictureById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.getAnswerPictureById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield answer_pictures_dao_1.default.updateAnswerPictureById(id, resource);
        });
    }
}
exports.default = new AnswerPicturesService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnBpY3R1cmVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hbnN3ZXIucGljdHVyZXMvc2VydmljZXMvYW5zd2VyLnBpY3R1cmVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRkFBNEQ7QUFNNUQsTUFBTSxxQkFBcUI7SUFDbkIsTUFBTSxDQUFDLFFBQWdDOztZQUMzQyxPQUFPLE1BQU0sNkJBQWlCLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLEVBQVU7O1lBQ3pCLE9BQU8sTUFBTSw2QkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsTUFBMkIsRUFBRSxNQUFjOztZQUNwRCxPQUFPLE1BQU0sNkJBQWlCLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pFLENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxFQUFVLEVBQUUsUUFBK0I7O1lBQ3pELE9BQU8sTUFBTSw2QkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEVBQVU7O1lBQ3RCLE9BQU8sTUFBTSw2QkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsRUFBVSxFQUFFLFFBQTZCOztZQUNyRCxPQUFPLE1BQU0sNkJBQWlCLENBQUMsdUJBQXVCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxxQkFBcUIsRUFBRSxDQUFDIn0=