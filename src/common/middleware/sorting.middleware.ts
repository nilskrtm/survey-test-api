import { NextFunction, Request, Response } from 'express';
import { SortingParams } from '../types/sorting.params.type';

class SortingMiddleware {
  extractSortingParameters(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        'sortingOption' in req.query &&
        req.query &&
        'sortingType' in req.query &&
        req.query.sortingType
      ) {
        const sorting = {} as SortingParams;
        const sortingOption = req.query.sortingOption;
        let sortingType = req.query.sortingType;

        if (typeof sortingOption === 'string') {
          sorting.sortingOption = sortingOption;
        } else if (Array.isArray(sortingOption)) {
          if ((sortingOption as string[]).length > 0) {
            sorting.sortingOption = sortingOption.pop() as string;
          }
        }

        if (typeof sortingType === 'string') {
          if (
            sortingType === 'asc' ||
            sortingType === 'ascending' ||
            sortingType === 'desc' ||
            sortingType === 'descending'
          ) {
            sorting.sortingType = sortingType;
          }
        } else if (Array.isArray(sortingType)) {
          if ((sortingType as string[]).length > 0) {
            sortingType = sortingType.pop() as string;

            if (
              sortingType === 'asc' ||
              sortingType === 'ascending' ||
              sortingType === 'desc' ||
              sortingType === 'descending'
            ) {
              sorting.sortingType = sortingType;
            }
          }
        }

        if (sorting.sortingOption && sorting.sortingType) {
          req.body.sorting = sorting;
        }
      }
    } catch (err) {
      return res.status(400).send({ errors: ['Invalid sorting info'] });
    }

    next();
  }
}

export default new SortingMiddleware();
