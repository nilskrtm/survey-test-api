import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import AccessKeyController from './controllers/access.key.controller';

export class AccessKeyRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AccessKeyRoutes');
  }

  configureRoutes(): Application {
    this.app
      .route(`/access-key`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        AccessKeyController.getAccessKey,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        AccessKeyController.generateAccessKey,
      );

    this.app
      .route(`/access-key/generate`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        AccessKeyController.generateAccessKey,
      );

    return this.app;
  }
}
