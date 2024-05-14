import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { maxPerPage } from './paging.middleware';
import { RequestPagingParams } from '../types/paging.params.type';
import { FilteringParams } from '../types/filtering.params.type';

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.mapped());

      return res.status(400).send({ errors: errors.mapped() });
    }

    next();
  }

  verifyLocalsInBody(req: Request, res: Response, next: NextFunction) {
    if (!('locals' in req.body)) {
      req.body.locals = {};
    }

    next();
  }

  verifyRequestOptionsInBody(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET') {
      req.body.paging = {
        page: 1,
        perPage: maxPerPage,
      } as RequestPagingParams;
      req.body.filtering = {} as FilteringParams;
      req.body.sorting = undefined;
    }

    next();
  }

  decodePasswordInBody(req: Request, res: Response, next: NextFunction) {
    if (req.body['password'] && typeof req.body['password'] === 'string') {
      const encodedPassword: string = req.body['password'];

      req.body['password'] = Buffer.from(encodedPassword, 'base64').toString(
        'ascii',
      );
    }

    next();
  }
}

export default new BodyValidationMiddleware();
