import { NextFunction, Request, Response } from 'express';

export const artificialDelay: number = parseInt(
  process.env.ARTIFICIAL_DELAY || '-1',
);

class ArtificialDelayMiddleware {
  async addArtificialDelay(req: Request, res: Response, next: NextFunction) {
    if (artificialDelay > 0) {
      await new Promise<undefined>(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, artificialDelay);
      });
    }

    next();
  }
}

export default new ArtificialDelayMiddleware();
