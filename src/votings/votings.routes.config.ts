import { CommonRoutesConfig } from '../common/common.routes.config';
import { Application } from 'express';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import { body, query } from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import VotingsMiddleware from './middleware/votings.middleware';
import VotingsController from './controllers/votings.controller';
import SurveysMiddleware from '../surveys/middleware/surveys.middleware';
import PermissionMiddleware from '../common/middleware/permission.middleware';

export class VotingsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'VotingsRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/surveys/:surveyId/votings`)
      .post(
        AuthMiddleware.validAuthorizationNeeded(false, true),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsNoDraft,
        body('_id').not().exists(),
        body('date').isISO8601().toDate().exists(),
        body('votes').isArray().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        VotingsMiddleware.validVoteData,
        VotingsController.createVoting,
      );

    this.app
      .route(`/surveys/:surveyId/votings/absolute`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        VotingsController.getVotingsAbsoluteOfSurvey,
      );

    this.app
      .route(`/surveys/:surveyId/votings/day-span`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        VotingsController.getVotingsDaySpanOfSurvey,
      );

    this.app.route(`/surveys/:surveyId/votings/count`).get(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      SurveysMiddleware.extractSurveyId,
      SurveysMiddleware.validateSurveyExists,
      PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
      query('timezone')
        .custom(value => {
          if (typeof value === 'string') {
            try {
              Intl.DateTimeFormat(undefined, { timeZone: value });

              return true;
            } catch (ex) {}
          }

          throw new Error('invalid value for timezone');
        })
        .optional(),
      query('startDate').isISO8601().exists(),
      query('endDate').isISO8601().exists(),
      VotingsController.getVotingCountOfSurvey,
    );

    return this.app;
  }
}
