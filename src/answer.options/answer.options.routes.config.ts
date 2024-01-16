import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import SurveysMiddleware from '../surveys/middleware/surveys.middleware';
import PermissionMiddleware from '../common/middleware/permission.middleware';
import QuestionsMiddleware from '../questions/middleware/questions.middleware';
import AnswerOptionsController from './controllers/answer.options.controller';
import { body } from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import AnswerOptionsMiddleware from './middleware/answer.options.middleware';

export class AnswerOptionsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AnswerOptionsRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/surveys/:surveyId/questions/:questionId/answer-options`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        AnswerOptionsController.listAnswerOptions,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        body('_id').not().exists(),
        body('order').not().exists(),
        body('color').isString().optional(),
        body('picture').isString().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerOptionsMiddleware.answerPictureToSetExists,
        AnswerOptionsController.createAnswerOption,
      );

    this.app
      .route(`/surveys/:surveyId/questions/:questionId/answer-options/reorder`)
      .patch(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        body('ordering').isObject().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerOptionsMiddleware.isValidAnswerOptionOrdering,
        AnswerOptionsController.reorderAnswerOptions,
      );

    this.app.param(
      `answerOptionId`,
      AnswerOptionsMiddleware.extractAnswerOptionId,
    );

    this.app
      .route(
        `/surveys/:surveyId/questions/:questionId/answer-options/:answerOptionId`,
      )
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        AnswerOptionsMiddleware.validateAnswerOptionExists,
        AnswerOptionsController.getAnswerOptionById,
      );

    this.app
      .route(
        `/surveys/:surveyId/questions/:questionId/answer-options/:answerOptionId`,
      )
      .delete(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        AnswerOptionsMiddleware.validateAnswerOptionExists,
        AnswerOptionsController.removeAnswerOption,
      );

    this.app
      .route(
        `/surveys/:surveyId/questions/:questionId/answer-options/:answerOptionId`,
      )
      .put(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        body('_id').not().exists(),
        body('order').not().exists(),
        body('color').isString().optional(),
        body('picture').isString().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerOptionsMiddleware.answerPictureToSetExists,
        AnswerOptionsController.put,
      );

    this.app
      .route(
        `/surveys/:surveyId/questions/:questionId/answer-options/:answerOptionId`,
      )
      .patch(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.extractSurveyId,
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysMiddleware.validateSurveyIsDraft,
        QuestionsMiddleware.extractQuestionId,
        QuestionsMiddleware.validateQuestionExists,
        body('_id').not().exists(),
        body('order').not().exists(),
        body('color').isString().optional(),
        body('picture').isString().optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerOptionsMiddleware.answerPictureToSetExists,
        AnswerOptionsController.patch,
      );

    return this.app;
  }
}
