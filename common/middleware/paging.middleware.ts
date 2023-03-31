import {NextFunction, Request, Response} from 'express';

// @ts-ignore
const maxPerPage: number = Number(process.env.MAX_PER_PAGE) || 50;

const roundUp = (number: number, decimals: number) => {
  if (decimals === 0) {
    return Math.ceil(number);
  }

  const factor = 10 ** decimals;

  return Math.ceil(number * factor) / factor;
};

class PagingMiddleware {
  extractPagingParameters(req: Request, res: Response, next: NextFunction) {
    try {
      let paging: RequestPagingParams = {
        page: 1,
        perPage: maxPerPage,
      };

      if ('page' in req.query && !isNaN(Number(req.query.page))) {
        paging.page = Number(req.query.page);
      }

      if ('perPage' in req.query && !isNaN(Number(req.query.perPage))) {
        if (Number(req.query.perPage) > maxPerPage) {
          paging.perPage = maxPerPage;
        } else {
          paging.perPage = Number(req.query.perPage);
        }
      }

      req.body.paging = paging;
    } catch (err) {
      return res.status(400).send({errors: ['Invalid paging info']});
    }

    next();
  }

  dummyPagingParameters(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.paging = {
        page: 1,
        perPage: maxPerPage,
      };
    } catch (err) {
      return res
        .status(400)
        .send({errors: ['Error setting dummy paging info']});
    }

    next();
  }

  calculatePaging(requestParams: RequestPagingParams, count: number) {
    let offset: number = requestParams.perPage * (requestParams.page - 1);
    let lastPage: number = roundUp(count / requestParams.perPage, 0);
    let lastPageOffset: number = requestParams.perPage * (lastPage - 1);

    if (lastPage === 0) {
      lastPage = 1;
    }

    let paging: PagingParams = {
      perPage: requestParams.perPage,
      page: requestParams.page,
      lastPage: lastPage,
      offset: offset,
      count: count,
    };

    if (count - offset < 1) {
      if (count != 0) {
        paging.page = lastPage;
        paging.offset = lastPageOffset;
      } else {
        paging.page = 1;
        paging.offset = 0;
      }
    }

    return paging;
  }

  ignoreValue<T>(value: T): T {
    return value;
  }
}

export default new PagingMiddleware();
