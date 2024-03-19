import { Request, Response, NextFunction } from 'express';
import UserService from '../services/users.service';

// const log: debug.IDebugger = debug('app:users-controllers');

class UsersMiddleware {
  async validateSameUsernameDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await UserService.getUserByUsername(req.body.username);

    if (user) {
      res
        .status(400)
        .send({ errors: [`Der Nutzername ist bereits vergeben.`] });
    } else {
      next();
    }
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const user = await UserService.getById(req.params.userId);

    if (user) {
      res.locals.user = user;

      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
    }
  }

  userCantChangePermission(req: Request, res: Response, next: NextFunction) {
    if (
      'permissionLevel' in req.body &&
      req.body.permissionLevel !== res.locals.user.permissionLevel
    ) {
      res.status(400).send({
        error: ['User cannot change permission level'],
      });
    } else {
      next();
    }
  }

  userCantDeleteSelf(req: Request, res: Response, next: NextFunction) {
    const toDeleteId = req.body.locals.userId;

    if (
      toDeleteId !== res.locals.jwt?.userId &&
      toDeleteId !== res.locals.basicAuth?.userId
    ) {
      next();
    } else {
      res.status(400).send({
        error: ['User cannot delete self'],
      });
    }
  }

  extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.locals.userId = req.params.userId;

    next();
  }
}

export default new UsersMiddleware();
