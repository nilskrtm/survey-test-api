import * as dotenv from 'dotenv';

const dotenvResult: dotenv.DotenvConfigOutput = dotenv.config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
});

if (dotenvResult.error) {
  throw dotenvResult.error;
}

import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import debug from 'debug';
import helmet from 'helmet';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import { SurveysRoutes } from './surveys/surveys.routes.config';
import { QuestionsRoutes } from './questions/questions.routes.config';
import { AnswerOptionsRoutes } from './answer.options/answer.options.routes.config';
import { AnswerPicturesRoutes } from './answer.pictures/answer.pictures.routes.config';
import { VotingsRoutes } from './votings/votings.routes.config';
import { DashboardRoutes } from './dashboard/dashboard.routes.config';
import BodyValidationMiddleware from './common/middleware/body.validation.middleware';
import WebSocketService from './common/services/ws.service';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: number = parseInt(process.env.PORT || '5000');
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
  ),
  meta: (process.env.META || 'true') === 'true',
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(expressWinston.logger(loggerOptions));
app.use(BodyValidationMiddleware.verifyLocalsInBody);

routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new SurveysRoutes(app));
routes.push(new QuestionsRoutes(app));
routes.push(new AnswerOptionsRoutes(app));
routes.push(new AnswerPicturesRoutes(app));
routes.push(new VotingsRoutes(app));
routes.push(new DashboardRoutes(app));

WebSocketService.setup(server);

server.listen(port, async () => {
  routes.forEach((route: CommonRoutesConfig) => {
    route.configureRoutes();

    debugLog(`Routes configured for ${route.getName()}`);
  });

  WebSocketService.startHeartbeat();

  debugLog(`Server running on port ${port}`);
});
