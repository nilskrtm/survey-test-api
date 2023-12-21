import { Request, Response, NextFunction } from 'express';
import { PermissionLevel } from '../enums/common.permissionlevel.enum';
import debug from 'debug';
import { AnswerPicture } from '../../answer.pictures/daos/answer.pictures.dao';

const log: debug.IDebugger = debug('app:common-permission-middleware');

class PermissionMiddleware {
  permissionLevelRequired(requiredPermissionLevel: PermissionLevel) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const userPermissionLevel = parseInt(
          res.locals.jwt?.permissionLevel ||
            res.locals.basicAuth?.permissionLevel,
        );

        if (userPermissionLevel === requiredPermissionLevel) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (e) {
        log(e);
      }
    };
  }

  onlySameUserOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = res.locals.jwt?.userId || res.locals.basicAuth?.userId;
    const userPermissionLevel = parseInt(
      res.locals.jwt?.permissionLevel || res.locals.basicAuth?.permissionLevel,
    );

    if (req.params && req.params.userId && req.params.userId === userId) {
      return next();
    } else {
      if (userPermissionLevel === PermissionLevel.ADMIN) {
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }

  onlySurveyOwnerOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const survey = res.locals.survey;
    const userId = res.locals.jwt?.userId || res.locals.basicAuth?.userId;

    if (survey.owner === userId) {
      next();
    } else {
      const userPermissionLevel = parseInt(
        res.locals.jwt?.permissionLevel ||
          res.locals.basicAuth?.permissionLevel,
      );

      if (userPermissionLevel === PermissionLevel.ADMIN) {
        next();
      } else {
        res.status(403).send();
      }
    }
  }

  onlyAnswerPictureOwnerOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const answerPicture: AnswerPicture = res.locals.answerPicture;
    const userId = res.locals.jwt?.userId || res.locals.basicAuth?.userId;

    if (answerPicture.owner === userId) {
      next();
    } else {
      const userPermissionLevel = parseInt(
        res.locals.jwt?.permissionLevel ||
          res.locals.basicAuth?.permissionLevel,
      );

      if (userPermissionLevel === PermissionLevel.ADMIN) {
        next();
      } else {
        res.status(403).send();
      }
    }
  }
}

const commonPermissionMiddleware = new PermissionMiddleware();

export default commonPermissionMiddleware;
