"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const log = (0, debug_1.default)('app:auth-controller');
const jwtSecret = process.env.JWT_SECRET || 'random';
const tokenExpirationInSeconds = 36000;
class AuthController {
    createJWT(req, res) {
        try {
            const refreshId = req.body.userId + jwtSecret;
            const salt = crypto_1.default.createSecretKey(crypto_1.default.randomBytes(16));
            const hash = crypto_1.default
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jsonwebtoken_1.default.sign(req.body, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            return res.status(201).send({ accessToken: token, refreshToken: hash });
        }
        catch (err) {
            log('createJWT error: %O', err);
            return res.status(500).send();
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXV0aC9jb250cm9sbGVycy9hdXRoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxrREFBMEI7QUFDMUIsZ0VBQStCO0FBQy9CLG9EQUE0QjtBQUU1QixNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUxRCxNQUFNLFNBQVMsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUM7QUFDN0QsTUFBTSx3QkFBd0IsR0FBRyxLQUFLLENBQUM7QUFFdkMsTUFBTSxjQUFjO0lBQ2xCLFNBQVMsQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUNuQyxJQUFJO1lBQ0YsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQzlDLE1BQU0sSUFBSSxHQUFHLGdCQUFNLENBQUMsZUFBZSxDQUFDLGdCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsTUFBTSxJQUFJLEdBQUcsZ0JBQU07aUJBQ2hCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO2lCQUMxQixNQUFNLENBQUMsU0FBUyxDQUFDO2lCQUNqQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFcEIsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXBDLE1BQU0sS0FBSyxHQUFHLHNCQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUMxQyxTQUFTLEVBQUUsd0JBQXdCO2FBQ3BDLENBQUMsQ0FBQztZQUVILE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixHQUFHLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFaEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxjQUFjLEVBQUUsQ0FBQyJ9