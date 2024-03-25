import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../common/common.routes.config';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import UsersMiddleware from './middleware/users.middleware';
import PermissionMiddleware from '../common/middleware/permission.middleware';
import PagingMiddleware from '../common/middleware/paging.middleware';
import UsersController from './controllers/users.controller';
import { PermissionLevel } from '../common/enums/common.permissionlevel.enum';
import AuthMiddleware from '../auth/middleware/auth.middleware';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UsersRoutes');
  }

  configureRoutes(): Application {
    this.app
      .route(`/users`)
      .get(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        PermissionMiddleware.permissionLevelRequired(PermissionLevel.ADMIN),
        PagingMiddleware.extractPagingParameters,
        UsersController.listUsers,
      )
      .post(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        PermissionMiddleware.permissionLevelRequired(PermissionLevel.ADMIN),
        BodyValidationMiddleware.decodePasswordInBody,
        body('_id').not().exists(),
        body('username')
          .isString()
          .isLength({ min: 2, max: 20 })
          .withMessage(
            'Der Nutzername muss zwischen 2 und 20 Zeichen lang sein.',
          ),
        body('email')
          .isString()
          .isEmail()
          .withMessage('Es muss eine gültige E-Mail Adresse angegeben werden.'),
        body('firstname')
          .isString()
          .isLength({ min: 2, max: 35 })
          .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.'),
        body('lastname')
          .isString()
          .isLength({ min: 2, max: 35 })
          .withMessage(
            'Der Nachname muss zwischen 2 und 35 Zeichen lang sein.',
          ),
        body('password')
          .isLength({ min: 8, max: 40 })
          .withMessage(
            'Das Passwort muss zwischen 8 und 40 Zeichen lang sein.',
          ),
        body('accessKey').isString().optional(),
        body('permissionLevel').isInt({ min: 0, max: 1 }).optional(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameUsernameDoesntExist,
        UsersController.createUser,
      );

    this.app.param(`userId`, UsersMiddleware.extractUserId);

    this.app
      .route(`/users/:userId`)
      .all(
        AuthMiddleware.validAuthorizationNeeded(true, false),
        UsersMiddleware.validateUserExists,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      )
      .get(UsersController.getUserById)
      .delete(UsersMiddleware.userCantDeleteSelf, UsersController.removeUser);

    this.app.put(`/users/:userId`, [
      BodyValidationMiddleware.decodePasswordInBody,
      body('_id').not().exists(),
      body('username').not().exists(),
      body('email')
        .isString()
        .isEmail()
        .withMessage('Es muss eine gültige E-Mail Adresse angegeben werden.'),
      body('firstname')
        .isString()
        .isLength({ min: 2, max: 35 })
        .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.'),
      body('lastname')
        .isString()
        .isLength({ min: 2, max: 35 })
        .withMessage('Der Nachname muss zwischen 2 und 35 Zeichen lang sein.'),
      body('password')
        .isLength({ min: 8, max: 40 })
        .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.'),
      body('accessKey').not().exists(),
      body('permissionLevel').isInt({ min: 0, max: 1 }),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.userCantChangePermission,
      UsersController.put,
    ]);

    this.app.patch(`/users/:userId`, [
      BodyValidationMiddleware.decodePasswordInBody,
      body('_id').not().exists(),
      body('username').not().exists(),
      body('email')
        .isString()
        .isEmail()
        .withMessage('Es muss eine gültige E-Mail Adresse angegeben werden.')
        .optional(),
      body('firstname')
        .isString()
        .isLength({ min: 2, max: 35 })
        .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.')
        .optional(),
      body('lastname')
        .isString()
        .isLength({ min: 2, max: 35 })
        .withMessage('Der Nachname muss zwischen 2 und 35 Zeichen lang sein.')
        .optional(),
      body('password')
        .isLength({ min: 8, max: 40 })
        .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.')
        .optional(),
      body('permissionLevel').isInt({ min: 0, max: 1 }).optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.userCantChangePermission,
      UsersController.patch,
    ]);

    return this.app;
  }
}
