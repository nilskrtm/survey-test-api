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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const users_service_1 = __importDefault(require("../../users/services/users.service"));
// @ts-expect-error
const jwtSecret = process.env.JWT_SECRET;
class JwtMiddleware {
    verifyRefreshBodyField(req, res, next) {
        if (req.body && req.body.refreshToken) {
            return next();
        }
        else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }
    validRefreshNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByUsernameWithPassword(res.locals.jwt.username);
            const salt = crypto_1.default.createSecretKey(Buffer.from(res.locals.jwt.refreshKey.data));
            const hash = crypto_1.default
                .createHmac('sha512', salt)
                .update(res.locals.jwt.userId + jwtSecret)
                .digest('base64');
            if (hash === req.body.refreshToken) {
                req.body = {
                    userId: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    permissionLevel: user.permissionLevel,
                };
                return next();
            }
            else {
                return res.status(400).send({ errors: ['Invalid refresh token'] });
            }
        });
    }
    _validJWTNeeded(req, res, next) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                }
                else {
                    res.locals.jwt = jsonwebtoken_1.default.verify(authorization[1], jwtSecret);
                    next();
                }
            }
            catch (err) {
                return res.status(403).send();
            }
        }
        else {
            return res.status(401).send();
        }
    }
}
exports.default = new JwtMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hdXRoL21pZGRsZXdhcmUvand0Lm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnRUFBK0I7QUFDL0Isb0RBQTRCO0FBRTVCLHVGQUE4RDtBQUU5RCxtQkFBbUI7QUFDbkIsTUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7QUFFakQsTUFBTSxhQUFhO0lBQ2pCLHNCQUFzQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDcEUsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDZjthQUFNO1lBQ0wsT0FBTyxHQUFHO2lCQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsc0NBQXNDLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDO0lBRUssa0JBQWtCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7WUFDdEUsTUFBTSxJQUFJLEdBQVEsTUFBTSx1QkFBWSxDQUFDLDZCQUE2QixDQUNoRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQ3hCLENBQUM7WUFDRixNQUFNLElBQUksR0FBRyxnQkFBTSxDQUFDLGVBQWUsQ0FDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQzVDLENBQUM7WUFDRixNQUFNLElBQUksR0FBRyxnQkFBTTtpQkFDaEIsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUM7aUJBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO2lCQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEIsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0JBQ1QsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHO29CQUNoQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7aUJBQ3RDLENBQUM7Z0JBRUYsT0FBTyxJQUFJLEVBQUUsQ0FBQzthQUNmO2lCQUFNO2dCQUNMLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFDLENBQUMsQ0FBQzthQUNsRTtRQUNILENBQUM7S0FBQTtJQUVELGVBQWUsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzdELElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUNoQyxJQUFJO2dCQUNGLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUU5RCxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQ2pDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsc0JBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBUSxDQUFDO29CQUVoRSxJQUFJLEVBQUUsQ0FBQztpQkFDUjthQUNGO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQy9CO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksYUFBYSxFQUFFLENBQUMifQ==