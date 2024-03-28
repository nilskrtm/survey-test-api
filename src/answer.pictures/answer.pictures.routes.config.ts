import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import PagingMiddleware from '../common/middleware/paging.middleware';
import AnswerPicturesController from './controllers/answer.pictures.controller';
import AnswerPicturesMiddleware from './middleware/answer.pictures.middleware';
import { body, query } from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import PermissionMiddleware from '../common/middleware/permission.middleware';
import multer from 'multer';
import FilteringMiddleware from '../common/middleware/filtering.middleware';
import SortingMiddleware from '../common/middleware/sorting.middleware';

export class AnswerPicturesRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AnswerPicturesRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/answer-pictures`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        PagingMiddleware.extractPagingParameters,
        FilteringMiddleware.extractFilteringParameters,
        SortingMiddleware.extractSortingParameters,
        AnswerPicturesController.listAnswerPictures,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        multer().single('file'),
        body('_id').not().exists(),
        body('name')
          .isString()
          .isLength({ min: 1, max: 50 })
          .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
          .optional(),
        body('fileName').not().exists(),
        body('owner').not().exists(),
        body('created').not().exists(),
        body('edited').not().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerPicturesMiddleware.validateFormDataPictureValid,
        AnswerPicturesController.createAnswerPicture,
      );

    this.app
      .route(`/answer-pictures/urls`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        query('fileNames').exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        AnswerPicturesController.getAnswerPictureUrls,
      );

    this.app.param(
      `answerPictureId`,
      AnswerPicturesMiddleware.extractAnswerPictureId,
    );

    this.app
      .route(`/answer-pictures/:answerPictureId`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        AnswerPicturesMiddleware.validateAnswerPictureExists,
        PermissionMiddleware.onlyAnswerPictureOwnerOrAdminCanDoThisAction,
        AnswerPicturesController.getAnswerPictureById,
      );

    this.app
      .route(`/answer-pictures/:answerPictureId`)
      .delete(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        AnswerPicturesMiddleware.validateAnswerPictureExists,
        PermissionMiddleware.onlyAnswerPictureOwnerOrAdminCanDoThisAction,
        AnswerPicturesMiddleware.validateAnswerPictureNotUsed,
        AnswerPicturesController.removeAnswerPicture,
      );

    this.app.route(`/answer-pictures/:answerPictureId`).put(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      AnswerPicturesMiddleware.validateAnswerPictureExists,
      PermissionMiddleware.onlyAnswerPictureOwnerOrAdminCanDoThisAction,
      AnswerPicturesMiddleware.validateAnswerPictureNotUsed,
      multer().single('file'),
      BodyValidationMiddleware.verifyLocalsInBody, // needed because of multer
      AnswerPicturesMiddleware.extractAnswerPictureId, // needed because of multer
      body('_id').not().exists(),
      body('name')
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
        .optional(),
      body('fileName').not().exists(),
      body('owner').not().exists(),
      body('created').not().exists(),
      body('edited').not().exists(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AnswerPicturesMiddleware.validateFormDataPictureValid,
      AnswerPicturesController.put,
    );

    this.app.route(`/answer-pictures/:answerPictureId`).patch(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      AnswerPicturesMiddleware.validateAnswerPictureExists,
      PermissionMiddleware.onlyAnswerPictureOwnerOrAdminCanDoThisAction,
      AnswerPicturesMiddleware.validateAnswerPictureNotUsed,
      multer().single('file'),
      BodyValidationMiddleware.verifyLocalsInBody, // needed because of multer
      AnswerPicturesMiddleware.extractAnswerPictureId, // needed because of multer
      body('_id').not().exists(),
      body('name')
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
        .optional(),
      body('fileName').not().exists(),
      body('owner').not().exists(),
      body('created').not().exists(),
      body('edited').not().exists(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      AnswerPicturesMiddleware.validateFormDataPictureValid,
      AnswerPicturesController.patch,
    );

    this.app
      .route(`/answer-pictures/:answerPictureId/status`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        AnswerPicturesMiddleware.validateAnswerPictureExists,
        PermissionMiddleware.onlyAnswerPictureOwnerOrAdminCanDoThisAction,
        AnswerPicturesController.getAnswerPictureStatus,
      );

    return this.app;
  }
}
