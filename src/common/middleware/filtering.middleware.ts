import { NextFunction, Request, Response } from 'express';
import { FilteringParams } from '../types/filtering.params.type';

const filteringParamBlacklist = ['page', 'perPage'].map(param =>
  param.toLowerCase(),
);

class FilteringMiddleware {
  extractFilteringParameters(req: Request, res: Response, next: NextFunction) {
    try {
      let filtering: FilteringParams = {};

      for (let param in req.query) {
        if (!filteringParamBlacklist.includes(param.toLowerCase())) {
          const value = req.query[param];

          if (value) {
            if (typeof value === 'string') {
              filtering[param] = value;
            } else if (Array.isArray(value))
              if ((value as string[]).length > 0) {
                filtering[param] = value.pop() as string;
              }
          }
        }
      }

      req.body.filtering = filtering;
    } catch (err) {
      return res.status(400).send({ errors: ['Invalid filtering info'] });
    }

    next();
  }
}

export default new FilteringMiddleware();
