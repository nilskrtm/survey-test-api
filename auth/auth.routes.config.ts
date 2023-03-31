import {Application} from 'express';
import {body} from 'express-validator';
import {CommonRoutesConfig} from '../common/common.routes.config';
import AuthController from './controllers/auth.controller';
import AuthMiddleware from './middleware/auth.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import JwtMiddleware from './middleware/jwt.middleware';

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AuthRoutes');
  }

  configureRoutes(): Application {
    this.app.post(`/auth`, [
      body('username').isString(),
      body('password').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AuthMiddleware.verifyUserPassword,
      AuthController.createJWT,
    ]);

    this.app.post(`/auth/refresh-token`, [
      AuthMiddleware.validAuthorizationNeeded(true, false),
      JwtMiddleware.verifyRefreshBodyField,
      JwtMiddleware.validRefreshNeeded,
      AuthController.createJWT,
    ]);

    return this.app;
  }
}
