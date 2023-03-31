"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-expect-error
const jwtSecret = process.env.JWT_SECRET;
class AuthMiddleware {
    verifyUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByUsernameWithPassword(req.body.username);
            if (user) {
                const passwordHash = user.password;
                if (yield argon2.verify(passwordHash, req.body.password)) {
                    req.body = {
                        userId: user._id,
                        username: user.username,
                        permissionLevel: user.permissionLevel,
                    };
                    return next();
                }
            }
            res.status(400).send({ errors: ['Invalid username/email and/or password'] });
        });
    }
    validAuthorizationNeeded(jwtAllowed, accessKeyAllowed) {
        return function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                if (req.headers['authorization']) {
                    try {
                        const authorization = req.headers['authorization'].split(' ');
                        if (authorization[0] === 'Basic' && accessKeyAllowed) {
                            const b64Auth = authorization[1] || '';
                            const [username, accessKey] = Buffer.from(b64Auth, 'base64')
                                .toString()
                                .split(':');
                            const user = yield users_service_1.default.getUserByUsernameWithAccessKey(username);
                            if (user &&
                                user.accessKey.localeCompare(accessKey) === 0) {
                                res.locals.basicAuth = {
                                    userId: user._id,
                                    username: user.username,
                                };
                                return next();
                            }
                            return res.status(401).send();
                        }
                        if (authorization[0] === 'Bearer') {
                            res.locals.jwt = jsonwebtoken_1.default.verify(authorization[1], jwtSecret);
                            return next();
                        }
                        return res.status(401).send();
                    }
                    catch (err) {
                        return res.status(403).send();
                    }
                }
                else {
                    return res.status(401).send();
                }
            });
        };
    }
}
exports.default = new AuthMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXV0aC9taWRkbGV3YXJlL2F1dGgubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUZBQThEO0FBQzlELCtDQUFpQztBQUVqQyxnRUFBK0I7QUFHL0IsbUJBQW1CO0FBQ25CLE1BQU0sU0FBUyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBRWpELE1BQU0sY0FBYztJQUNaLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1lBQ3RFLE1BQU0sSUFBSSxHQUFRLE1BQU0sdUJBQVksQ0FBQyw2QkFBNkIsQ0FDaEUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQ2xCLENBQUM7WUFFRixJQUFJLElBQUksRUFBRTtnQkFDUixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUVuQyxJQUFJLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDeEQsR0FBRyxDQUFDLElBQUksR0FBRzt3QkFDVCxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7d0JBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDdkIsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO3FCQUN0QyxDQUFDO29CQUVGLE9BQU8sSUFBSSxFQUFFLENBQUM7aUJBQ2Y7YUFDRjtZQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsd0NBQXdDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQztLQUFBO0lBRUQsd0JBQXdCLENBQUMsVUFBbUIsRUFBRSxnQkFBeUI7UUFDckUsT0FBTyxVQUFnQixHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztnQkFDcEUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO29CQUNoQyxJQUFJO3dCQUNGLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUU5RCxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksZ0JBQWdCLEVBQUU7NEJBQ3BELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3ZDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO2lDQUN6RCxRQUFRLEVBQUU7aUNBQ1YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNkLE1BQU0sSUFBSSxHQUNSLE1BQU0sdUJBQVksQ0FBQyw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFFOUQsSUFDRSxJQUFJO2dDQUNILElBQUksQ0FBQyxTQUFvQixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQ3pEO2dDQUNBLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHO29DQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7b0NBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtpQ0FDeEIsQ0FBQztnQ0FFRixPQUFPLElBQUksRUFBRSxDQUFDOzZCQUNmOzRCQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt5QkFDL0I7d0JBRUQsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFOzRCQUNqQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxzQkFBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFRLENBQUM7NEJBRWhFLE9BQU8sSUFBSSxFQUFFLENBQUM7eUJBQ2Y7d0JBRUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUMvQjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQy9CO2lCQUNGO3FCQUFNO29CQUNMLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDL0I7WUFDSCxDQUFDO1NBQUEsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksY0FBYyxFQUFFLENBQUMifQ==