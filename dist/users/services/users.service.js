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
const users_dao_1 = __importDefault(require("../daos/users.dao"));
class UsersService {
    create(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.addUser(resource);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.removeUserById(id);
        });
    }
    list(paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.getUsers(paging);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.updateUserById(id, resource);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.getUserById(id);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.updateUserById(id, resource);
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.getUserByUsername(username);
        });
    }
    getUserByUsernameWithAccessKey(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.getUserByUsernameWithAccessKey(username);
        });
    }
    getUserByUsernameWithPassword(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_dao_1.default.getUserByUsernameWithPassword(username);
        });
    }
}
exports.default = new UsersService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3VzZXJzL3NlcnZpY2VzL3VzZXJzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrRUFBeUM7QUFNekMsTUFBTSxZQUFZO0lBQ1YsTUFBTSxDQUFDLFFBQXVCOztZQUNsQyxPQUFPLE1BQU0sbUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLEVBQVU7O1lBQ3pCLE9BQU8sTUFBTSxtQkFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFFSyxJQUFJLENBQUMsTUFBMkI7O1lBQ3BDLE9BQU8sTUFBTSxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsRUFBVSxFQUFFLFFBQXNCOztZQUNoRCxPQUFPLE1BQU0sbUJBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxFQUFVOztZQUN0QixPQUFPLE1BQU0sbUJBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEMsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLEVBQVUsRUFBRSxRQUFvQjs7WUFDNUMsT0FBTyxNQUFNLG1CQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFFSyxpQkFBaUIsQ0FBQyxRQUFnQjs7WUFDdEMsT0FBTyxNQUFNLG1CQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUFBO0lBRUssOEJBQThCLENBQUMsUUFBZ0I7O1lBQ25ELE9BQU8sTUFBTSxtQkFBUSxDQUFDLDhCQUE4QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7S0FBQTtJQUVLLDZCQUE2QixDQUFDLFFBQWdCOztZQUNsRCxPQUFPLE1BQU0sbUJBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRSxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksWUFBWSxFQUFFLENBQUMifQ==