import { NextFunction, Request, Response } from 'express';

class SortingMiddleware {
  extractSortingParameters(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.sorting = {};
    } catch (err) {
      return res.status(400).send({ errors: ['Invalid sorting info'] });
    }

    next();
  }
}

export default new SortingMiddleware();
