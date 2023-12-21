import { NextFunction, Request, RequestHandler, Response } from 'express';

class CombinerMiddleware {
  combine(middlewares: RequestHandler[]) {
    return middlewares.reduce(function (a, b) {
      return function (req: Request, res: Response, next: NextFunction) {
        a(req, res, function (err: any) {
          if (err) {
            return next(err);
          }

          b(req, res, next);
        });
      };
    });
  }
}

export default new CombinerMiddleware();
