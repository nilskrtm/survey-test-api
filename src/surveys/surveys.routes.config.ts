import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import PermissionMiddleware from '../common/middleware/permission.middleware';
import SurveysMiddleware from '../surveys/middleware/surveys.middleware';
import SurveysController from './controllers/surveys.controller';
import { body } from 'express-validator';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import PagingMiddleware from '../common/middleware/paging.middleware';
import AuthMiddleware from '../auth/middleware/auth.middleware';
import FilteringMiddleware from '../common/middleware/filtering.middleware';
import SortingMiddleware from '../common/middleware/sorting.middleware';
import SurveysDAO from './daos/surveys.dao';

export class SurveysRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'SurveysRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/surveys`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        PagingMiddleware.extractPagingParameters,
        FilteringMiddleware.extractFilteringParameters,
        SortingMiddleware.extractSortingParameters,
        SurveysController.listSurveys,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        body('_id').not().exists(),
        // needed to get userId in custom validator for name of survey
        (req, res, next) => {
          req.body._local_owner = res.locals.jwt.userId;

          next();
        },
        body('name')
          .isString()
          .isLength({ min: 1, max: 50 })
          .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
          .custom(async (value, { req }) => {
            const surveys = await SurveysDAO.getModel().aggregate([
              {
                $match: {
                  owner: req.body._local_owner,
                },
              },
              {
                $match: {
                  $expr: {
                    $eq: [
                      {
                        $toLower: '$name',
                      },
                      value.toLowerCase(),
                    ],
                  },
                },
              },
            ]);

            if (surveys.length > 0) {
              throw new Error(
                'Es existiert bereits eine Umfrage mit diesem Namen.',
              );
            }
          })
          .optional(),
        body('description')
          .isString()
          .isLength({ min: 1, max: 150 })
          .withMessage(
            'Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.',
          )
          .optional(),
        body('greeting')
          .isString()
          .isLength({ min: 1, max: 300 })
          .withMessage(
            'Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.',
          )
          .optional(),
        body('startDate').not().exists(),
        body('endDate').not().exists(),
        body('owner').not().exists(),
        body('created').not().exists(),
        body('edited').not().exists(),
        body('draft').not().exists(),
        body('archived').not().exists(),
        body('questions').not().exists(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        SurveysController.createSurvey,
      );

    this.app.route(`/surveys/:surveyId/finalize`).patch(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      SurveysMiddleware.validateSurveyExists,
      PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
      body('_id').not().exists(),
      body('name').not().exists(),
      body('greeting').not().exists(),
      body('description').not().exists(),
      body('owner').not().exists(),
      body('created').not().exists(),
      body('edited').not().exists(),
      body('draft')
        .isBoolean({ strict: true })
        .custom(value => value === false)
        .exists(),
      body('archived').not().exists(),
      body('questions').not().exists(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      SurveysMiddleware.validateSurveyModifiable,
      SurveysMiddleware.validateSetStartEndDates,
      SurveysMiddleware.validateSurveyFinalizable,
      SurveysController.patch,
    );

    this.app.param(`surveyId`, SurveysMiddleware.extractSurveyId);

    this.app
      .route(`/surveys/:surveyId`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, true),
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysController.getSurveyById,
      );

    this.app
      .route(`/surveys/:surveyId`)
      .delete(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        SurveysMiddleware.validateSurveyExists,
        PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
        SurveysController.removeSurvey,
      );

    this.app.route(`/surveys/:surveyId`).put(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      SurveysMiddleware.validateSurveyExists,
      PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,

      body('_id').not().exists(),
      // needed to get userId in custom validator for name of survey
      (req, res, next) => {
        req.body._local_owner = res.locals.jwt.userId;

        next();
      },
      body('name')
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
        .custom(async (value, { req }) => {
          const surveys = await SurveysDAO.getModel().aggregate([
            {
              $match: {
                owner: req.body._local_owner,
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toLower: '$name',
                    },
                    value.toLowerCase(),
                  ],
                },
              },
            },
          ]);

          if (surveys.length > 0) {
            throw new Error(
              'Es existiert bereits eine Umfrage mit diesem Namen.',
            );
          }
        })
        .optional(),
      body('description')
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage(
          'Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.',
        )
        .optional(),
      body('greeting')
        .isString()
        .isLength({ min: 1, max: 300 })
        .withMessage('Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.')
        .optional(),
      body('startDate').isISO8601().toDate().optional(),
      body('endDate').isISO8601().toDate().optional(),
      body('owner').not().exists(),
      body('created').not().exists(),
      body('edited').not().exists(),
      body('draft').not().exists(),
      body('archived').isBoolean().optional(),
      body('questions').not().exists(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      SurveysMiddleware.validateSurveyModifiable,
      SurveysMiddleware.validateSetStartEndDates,
      SurveysMiddleware.validateSurveyFinalizable,
      SurveysController.put,
    );

    this.app.route(`/surveys/:surveyId`).patch(
      AuthMiddleware.validAuthorizationNeeded(true, false),
      SurveysMiddleware.validateSurveyExists,
      PermissionMiddleware.onlySurveyOwnerOrAdminCanDoThisAction,
      body('_id').not().exists(),
      // needed to get userId in custom validator for name of survey
      (req, res, next) => {
        req.body._local_owner = res.locals.jwt.userId;

        next();
      },
      body('name')
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
        .custom(async (value, { req }) => {
          const surveys = await SurveysDAO.getModel().aggregate([
            {
              $match: {
                owner: req.body._local_owner,
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toLower: '$name',
                    },
                    value.toLowerCase(),
                  ],
                },
              },
            },
          ]);

          if (surveys.length > 0) {
            throw new Error(
              'Es existiert bereits eine Umfrage mit diesem Namen.',
            );
          }
        })
        .optional(),
      body('description')
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage(
          'Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.',
        )
        .optional(),
      body('greeting')
        .isString()
        .isLength({ min: 1, max: 300 })
        .withMessage('Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.')
        .optional(),
      body('startDate').isISO8601().toDate().optional(),
      body('endDate').isISO8601().toDate().optional(),
      body('owner').not().exists(),
      body('created').not().exists(),
      body('edited').not().exists(),
      body('draft').not().exists(),
      body('archived').isBoolean().optional(),
      body('questions').not().exists(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      SurveysMiddleware.validateSurveyModifiable,
      SurveysMiddleware.validateSetStartEndDates,
      SurveysMiddleware.validateSurveyFinalizable,
      SurveysController.patch,
    );

    return this.app;
  }
}
