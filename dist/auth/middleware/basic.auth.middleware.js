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
const users_service_1 = __importDefault(require("../../users/services/users.service"));
class BasicAuthMiddleware {
    validAccessTokenNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers['authorization']) {
                try {
                    const authorization = req.headers['authorization'].split(' ');
                    if (authorization[0] !== 'Basic') {
                        return res.status(401).send();
                    }
                    else {
                        const b64Auth = authorization[1] || '';
                        const [username, accessKey] = Buffer.from(b64Auth, 'base64')
                            .toString()
                            .split(':');
                        const user = yield users_service_1.default.getUserByUsernameWithAccessKey(username);
                        if (!user ||
                            user.accessKey.localeCompare(accessKey) !== 0) {
                            return res.status(401).send();
                        }
                        res.locals.basicAuth = {
                            userId: user._id,
                            username: user.username,
                        };
                        console.log('basic');
                        next();
                    }
                }
                catch (err) {
                    console.log(err);
                    return res.status(403).send();
                }
            }
            else {
                return res.status(401).send();
            }
        });
    }
}
exports.default = new BasicAuthMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMuYXV0aC5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXV0aC9taWRkbGV3YXJlL2Jhc2ljLmF1dGgubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHVGQUE4RDtBQUc5RCxNQUFNLG1CQUFtQjtJQUNqQixzQkFBc0IsQ0FDMUIsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjs7WUFFbEIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO2dCQUNoQyxJQUFJO29CQUNGLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUU5RCxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEVBQUU7d0JBQ2hDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDL0I7eUJBQU07d0JBQ0wsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDdkMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7NkJBQ3pELFFBQVEsRUFBRTs2QkFDVixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRWQsTUFBTSxJQUFJLEdBQVMsTUFBTSx1QkFBWSxDQUFDLDhCQUE4QixDQUNsRSxRQUFRLENBQ1QsQ0FBQzt3QkFFRixJQUNFLENBQUMsSUFBSTs0QkFDSixJQUFJLENBQUMsU0FBb0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUN6RDs0QkFDQSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQy9CO3dCQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHOzRCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7NEJBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTt5QkFDeEIsQ0FBQzt3QkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNyQixJQUFJLEVBQUUsQ0FBQztxQkFDUjtpQkFDRjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQy9CO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLG1CQUFtQixFQUFFLENBQUMifQ==