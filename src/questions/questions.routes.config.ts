import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import QuestionsMiddleware from '../questions/middleware/questions.middleware';
import QuestionsController from './controllers/questions.controller';
import PagingMiddleware from '../common/middleware/paging.middleware';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import SurveysMiddleware from '../surveys/middleware/surveys.middleware';
import PermissionMiddleware from '../common/middleware/permission.middleware';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';
import SurveysController from '../surveys/controllers/surveys.controller';

export class QuestionsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'QuestionsRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/surveys/:surveyId/questions`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        PagingMiddleware.dummyPagingParameters,
        QuestionsController.listQuestions,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        body('_id').not().exists(),
        body('question').isString().isLength({ min: 1, max: 300 }).optional(),
        body('timeout').isInt({ min: 0 }).optional(),
        body('order').not().exists(),
        body('answerOptions').not().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        QuestionsController.createQuestion,
      );

    this.app
      .route(`/surveys/:surveyId/questions/reorder`)
      .patch(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        body('ordering').isObject().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        QuestionsMiddleware.isValidQuestionOrdering,
        QuestionsController.reorderQuestions,
      );

    this.app.param(`questionId`, QuestionsMiddleware.extractQuestionId);

    this.app
      .route(`/surveys/:surveyId/questions/:questionId`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        QuestionsMiddleware.validateQuestionExists,
        QuestionsController.getQuestionById,
      );

    this.app
      .route(`/surveys/:surveyId/questions/:questionId`)
      .delete(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.validateQuestionExists,
        QuestionsController.removeQuestion,
      );

    this.app
      .route(`/surveys/:surveyId/questions/:questionId`)
      .put(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.validateQuestionExists,
        body('_id').not().exists(),
        body('question')
          .isString()
          .isLength({ min: 1, max: 300 })
          .withMessage('Die Frage darf maximal 300 Zeichen lang sein.')
          .optional(),
        body('timeout').isInt({ min: 0 }).optional(),
        body('order').not().exists(),
        body('answerOptions').not().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        QuestionsController.put,
      );

    this.app
      .route(`/surveys/:surveyId/questions/:questionId`)
      .patch(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.validateQuestionExists,
        body('_id').not().exists(),
        body('question')
          .isString()
          .isLength({ min: 1, max: 300 })
          .withMessage('Die Frage darf maximal 300 Zeichen lang sein.')
          .optional(),
        body('timeout').isInt({ min: 0 }).optional(),
        body('order').not().exists(),
        body('answerOptions').not().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        SurveysController.patch,
      );

    return this.app;
  }
}
