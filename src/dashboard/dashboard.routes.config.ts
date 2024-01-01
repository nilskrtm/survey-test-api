import { CommonRoutesConfig } from '../common/common.routes.config';
import { Application } from 'express';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import DashboardController from './controllers/dashboard.controller';

export class DashboardRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'DashboardRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/dashboard/metrics`)
      .get([
        AuthMiddleware.validAuthorizationNeeded(true, true),
        DashboardController.getDashboardMetrics,
      ]);

    return this.app;
  }
}
