import { FilterQuery, HydratedDocument, QueryWithHelpers } from 'mongoose';
import { AnswerPicture } from '../daos/answer.pictures.dao';
import { QueryHelpers } from '../../common/interfaces/query.helpers.interface';
import { FilteringParams } from '../../common/types/filtering.params.type';
import { SortingParams } from '../../common/types/sorting.params.type';

export interface IAnswerPictureQueryHelpers
  extends QueryHelpers<AnswerPicture> {}

const AnswerPictureQueryHelpers: IAnswerPictureQueryHelpers = {
  applyFiltering(
    this: QueryWithHelpers<
      HydratedDocument<AnswerPicture>[],
      HydratedDocument<AnswerPicture>,
      IAnswerPictureQueryHelpers
    >,
    filterParams: FilteringParams,
  ): QueryWithHelpers<
    HydratedDocument<AnswerPicture>[],
    HydratedDocument<AnswerPicture>,
    QueryHelpers<AnswerPicture>
  > {
    const filter: FilterQuery<AnswerPicture> = {};

    if ('keyword' in filterParams && typeof filterParams.keyword === 'string') {
      filter.name = {
        $regex: '.*' + filterParams.keyword + '.*',
        $options: 'i',
      };
    }

    if (
      'used' in filterParams &&
      typeof filterParams.used === 'string' &&
      (filterParams.used.toLowerCase() === 'true' ||
        filterParams.used.toLowerCase() === 'false')
    ) {
      if (filterParams.used === 'true') {
        filter.$expr = {
          $not: { $in: ['$_id', filterParams.unusedAnswerPictureIds] },
        };
      } else {
        filter.$expr = {
          $in: ['$_id', filterParams.unusedAnswerPictureIds],
        };
      }
    }

    return this.find(filter);
  },
  applySorting(
    this: QueryWithHelpers<
      HydratedDocument<AnswerPicture>[],
      HydratedDocument<AnswerPicture>,
      IAnswerPictureQueryHelpers
    >,
    sortingParams?: SortingParams,
  ): QueryWithHelpers<
    HydratedDocument<AnswerPicture>[],
    HydratedDocument<AnswerPicture>,
    QueryHelpers<AnswerPicture>
  > {
    if (sortingParams) {
      const sorter = {
        [sortingParams.sortingOption]: sortingParams.sortingType,
      };

      return this.sort(sorter);
    }

    return this;
  },
};

export default AnswerPictureQueryHelpers;
