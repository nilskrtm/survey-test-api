import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../common/common.routes.config';
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
      body('username')
        .exists()
        .isString()
        .notEmpty()
        .withMessage(
          'Es muss ein Nutzername oder eine E-Mail Adresse angegeben werden.',
        ),
      body('password')
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Es muss ein Passwort angegeben werden.'),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AuthMiddleware.verifyUserPassword,
      AuthController.createJWT,
    ]);

    this.app.post(`/auth/refresh-token`, [
      JwtMiddleware.verifyRefreshBodyField,
      JwtMiddleware.validRefreshNeeded,
      AuthController.refreshJWT,
    ]);

    this.app.post(`/auth/password-reset`, [
      body('email')
        .exists()
        .isString()
        .notEmpty()
        .withMessage('Es muss eine E-Mail Adresse angegeben werden.'),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      body('email')
        .isEmail()
        .withMessage('Die angegebene E-Mail ist im falschen Format.'),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AuthController.requestResetUserPassword,
    ]);

    this.app.post(`/auth/password-reset/validate`, [
      body('passwordRequestId').exists().isString().notEmpty(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      // AuthMiddleware.verifyPasswordRequestValid,
      AuthController.validateRequestResetUserPassword,
    ]);

    this.app.post(`/auth/password-reset/submit`, [
      body('passwordRequestId').exists().isString().notEmpty(),
      body('password')
        .exists()
        .isString()
        .isLength({ min: 8, max: 40 })
        .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.'),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AuthMiddleware.verifyPasswordRequestValid,
      AuthController.resetUserPassword,
    ]);

    return this.app;
  }
}
