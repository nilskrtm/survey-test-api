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
const dotenv = __importStar(require("dotenv"));
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const debug_1 = __importDefault(require("debug"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const users_routes_config_1 = require("./users/users.routes.config");
const auth_routes_config_1 = require("./auth/auth.routes.config");
const surveys_routes_config_1 = require("./surveys/surveys.routes.config");
const questions_routes_config_1 = require("./questions/questions.routes.config");
const answer_options_routes_config_1 = require("./answer.options/answer.options.routes.config");
const answer_pictures_routes_config_1 = require("./answer.pictures/answer.pictures.routes.config");
const votings_routes_config_1 = require("./votings/votings.routes.config");
const body_validation_middleware_1 = __importDefault(require("./common/middleware/body.validation.middleware"));
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes = [];
const debugLog = (0, debug_1.default)('app');
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
    meta: !!process.env.DEBUG,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(expressWinston.logger(loggerOptions));
app.use(body_validation_middleware_1.default.verifyLocalsInBody);
routes.push(new users_routes_config_1.UsersRoutes(app));
routes.push(new auth_routes_config_1.AuthRoutes(app));
routes.push(new surveys_routes_config_1.SurveysRoutes(app));
routes.push(new questions_routes_config_1.QuestionsRoutes(app));
routes.push(new answer_options_routes_config_1.AnswerOptionsRoutes(app));
routes.push(new answer_pictures_routes_config_1.AnswerPicturesRoutes(app));
routes.push(new votings_routes_config_1.VotingsRoutes(app));
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    routes.forEach((route) => {
        route.configureRoutes();
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(`Server running on port ${port}`);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFFakMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRXJDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRTtJQUN0QixNQUFNLFlBQVksQ0FBQyxLQUFLLENBQUM7Q0FDMUI7QUFFRCxzREFBOEI7QUFDOUIsMkNBQTZCO0FBQzdCLGlEQUFtQztBQUNuQyxnRUFBa0Q7QUFDbEQsa0RBQTBCO0FBQzFCLG9EQUE0QjtBQUM1QixnREFBd0I7QUFFeEIscUVBQXdEO0FBQ3hELGtFQUFxRDtBQUNyRCwyRUFBOEQ7QUFDOUQsaUZBQW9FO0FBQ3BFLGdHQUFrRjtBQUNsRixtR0FBcUY7QUFDckYsMkVBQThEO0FBQzlELGdIQUFzRjtBQUV0RixNQUFNLEdBQUcsR0FBd0IsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDM0MsTUFBTSxNQUFNLEdBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0FBQ3RDLE1BQU0sTUFBTSxHQUE4QixFQUFFLENBQUM7QUFDN0MsTUFBTSxRQUFRLEdBQW9CLElBQUEsZUFBSyxFQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLE1BQU0sYUFBYSxHQUFpQztJQUNsRCxVQUFVLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUNyQztJQUNELElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0NBQzFCLENBQUM7QUFFRixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsZ0JBQU0sR0FBRSxDQUFDLENBQUM7QUFDbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQ0FBd0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRXJELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQ0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLCtCQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkscUNBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSx5Q0FBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGtEQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG9EQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHFDQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVwQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFTLEVBQUU7SUFDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQXlCLEVBQUUsRUFBRTtRQUMzQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFeEIsUUFBUSxDQUFDLHlCQUF5QixLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUEsQ0FBQyxDQUFDIn0=