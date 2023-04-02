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
                        firstName: user.firstName,
                        lastName: user.lastName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXV0aC9taWRkbGV3YXJlL2F1dGgubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUZBQThEO0FBQzlELCtDQUFpQztBQUVqQyxnRUFBK0I7QUFHL0IsbUJBQW1CO0FBQ25CLE1BQU0sU0FBUyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBRWpELE1BQU0sY0FBYztJQUNaLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1lBQ3RFLE1BQU0sSUFBSSxHQUFRLE1BQU0sdUJBQVksQ0FBQyw2QkFBNkIsQ0FDaEUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQ2xCLENBQUM7WUFFRixJQUFJLElBQUksRUFBRTtnQkFDUixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUVuQyxJQUFJLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDeEQsR0FBRyxDQUFDLElBQUksR0FBRzt3QkFDVCxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7d0JBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTt3QkFDdkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO3dCQUN6QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ3ZCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtxQkFDdEMsQ0FBQztvQkFFRixPQUFPLElBQUksRUFBRSxDQUFDO2lCQUNmO2FBQ0Y7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLHdDQUF3QyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7S0FBQTtJQUVELHdCQUF3QixDQUFDLFVBQW1CLEVBQUUsZ0JBQXlCO1FBQ3JFLE9BQU8sVUFBZ0IsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7Z0JBQ3BFLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFDaEMsSUFBSTt3QkFDRixNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFOUQsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLGdCQUFnQixFQUFFOzRCQUNwRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUN2QyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztpQ0FDekQsUUFBUSxFQUFFO2lDQUNWLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxNQUFNLElBQUksR0FDUixNQUFNLHVCQUFZLENBQUMsOEJBQThCLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBRTlELElBQ0UsSUFBSTtnQ0FDSCxJQUFJLENBQUMsU0FBb0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUN6RDtnQ0FDQSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRztvQ0FDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHO29DQUNoQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUNBQ3hCLENBQUM7Z0NBRUYsT0FBTyxJQUFJLEVBQUUsQ0FBQzs2QkFDZjs0QkFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQy9CO3dCQUVELElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTs0QkFDakMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsc0JBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBUSxDQUFDOzRCQUVoRSxPQUFPLElBQUksRUFBRSxDQUFDO3lCQUNmO3dCQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDL0I7b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUMvQjtpQkFDRjtxQkFBTTtvQkFDTCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQy9CO1lBQ0gsQ0FBQztTQUFBLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLGNBQWMsRUFBRSxDQUFDIn0=