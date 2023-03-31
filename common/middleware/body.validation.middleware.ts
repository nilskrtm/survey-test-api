import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(400).send({errors: errors.mapped()});
    }

    next();
  }

  verifyLocalsInBody(req: Request, res: Response, next: NextFunction) {
    if (!('locals' in req.body)) {
      req.body.locals = {};
    }

    next();
  }
}

export default new BodyValidationMiddleware();
