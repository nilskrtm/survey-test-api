import { NextFunction, Request, Response } from 'express';

class FilteringMiddleware {
  extractFilteringParameters(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.filtering = {};
    } catch (err) {
      return res.status(400).send({ errors: ['Invalid filtering info'] });
    }

    next();
  }
}

export default new FilteringMiddleware();
