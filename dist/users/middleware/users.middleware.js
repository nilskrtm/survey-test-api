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
const users_service_1 = __importDefault(require("../services/users.service"));
//const log: debug.IDebugger = debug('app:users-controllers');
class UsersMiddleware {
    validateSameUsernameDoesntExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByUsername(req.body.username);
            if (user) {
                res.status(400).send({ error: `User username already exists` });
            }
            else {
                next();
            }
        });
    }
    validateUserExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getById(req.params.userId);
            if (user) {
                res.locals.user = user;
                next();
            }
            else {
                res.status(404).send({
                    error: `User ${req.params.userId} not found`,
                });
            }
        });
    }
    userCantChangePermission(req, res, next) {
        if ('permissionLevel' in req.body &&
            req.body.permissionLevel !== res.locals.user.permissionLevel) {
            res.status(400).send({
                error: ['User cannot change permission level'],
            });
        }
        else {
            next();
        }
    }
    userCantDeleteSelf(req, res, next) {
        var _a, _b;
        const toDeleteId = req.body.locals.userId;
        if (toDeleteId !== ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) &&
            toDeleteId !== ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId)) {
            next();
        }
        else {
            res.status(400).send({
                error: ['User cannot delete self'],
            });
        }
    }
    extractUserId(req, res, next) {
        req.body.locals.userId = req.params.userId;
        next();
    }
}
exports.default = new UsersMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3VzZXJzL21pZGRsZXdhcmUvdXNlcnMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLDhFQUFvRDtBQUVwRCw4REFBOEQ7QUFFOUQsTUFBTSxlQUFlO0lBQ2IsK0JBQStCLENBQ25DLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7O1lBRWxCLE1BQU0sSUFBSSxHQUFHLE1BQU0sdUJBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXBFLElBQUksSUFBSSxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLDhCQUE4QixFQUFDLENBQUMsQ0FBQzthQUMvRDtpQkFBTTtnQkFDTCxJQUFJLEVBQUUsQ0FBQzthQUNSO1FBQ0gsQ0FBQztLQUFBO0lBRUssa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7WUFDdEUsTUFBTSxJQUFJLEdBQUcsTUFBTSx1QkFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTFELElBQUksSUFBSSxFQUFFO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFFdkIsSUFBSSxFQUFFLENBQUM7YUFDUjtpQkFBTTtnQkFDTCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsS0FBSyxFQUFFLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLFlBQVk7aUJBQzdDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQztLQUFBO0lBRUQsd0JBQXdCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUN0RSxJQUNFLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxJQUFJO1lBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFDNUQ7WUFDQSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkIsS0FBSyxFQUFFLENBQUMscUNBQXFDLENBQUM7YUFDL0MsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksRUFBRSxDQUFDO1NBQ1I7SUFDSCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7UUFDaEUsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRTFDLElBQ0UsVUFBVSxNQUFLLE1BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLE1BQU0sQ0FBQTtZQUNyQyxVQUFVLE1BQUssTUFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsMENBQUUsTUFBTSxDQUFBLEVBQzNDO1lBQ0EsSUFBSSxFQUFFLENBQUM7U0FDUjthQUFNO1lBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxDQUFDLHlCQUF5QixDQUFDO2FBQ25DLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUUzQyxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksZUFBZSxFQUFFLENBQUMifQ==