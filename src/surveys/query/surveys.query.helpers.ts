import { FilterQuery, HydratedDocument, QueryWithHelpers } from 'mongoose';
import { Survey } from '../daos/surveys.dao';
import { QueryHelpers } from '../../common/interfaces/query.helpers.interface';
import { FilteringParams } from '../../common/types/filtering.params.type';
import { SortingParams } from '../../common/types/sorting.params.type';

export interface ISurveyQueryHelpers extends QueryHelpers<Survey> {}

const SurveyQueryHelpers: ISurveyQueryHelpers = {
  applyFiltering(
    this: QueryWithHelpers<
      HydratedDocument<Survey>[],
      HydratedDocument<Survey>,
      ISurveyQueryHelpers
    >,
    filterParams: FilteringParams,
  ): QueryWithHelpers<
    HydratedDocument<Survey>[],
    HydratedDocument<Survey>,
    QueryHelpers<Survey>
  > {
    const filter: FilterQuery<Survey> = {};

    if ('keyword' in filterParams) {
      filter.name = {
        $regex: '.*' + filterParams.keyword + '.*',
        $options: 'i',
      };
    }

    if (
      'archived' in filterParams &&
      (filterParams.archived.toLowerCase() === 'true' ||
        filterParams.archived.toLowerCase() === 'false')
    ) {
      filter.archived = filterParams.archived;
    }

    if (
      'draft' in filterParams &&
      (filterParams.draft.toLowerCase() === 'true' ||
        filterParams.draft.toLowerCase() === 'false')
    ) {
      filter.draft = filterParams.draft;
    }

    return this.find(filter);
  },
  applySorting(
    this: QueryWithHelpers<
      HydratedDocument<Survey>[],
      HydratedDocument<Survey>,
      ISurveyQueryHelpers
    >,
    sortingParams?: SortingParams,
  ): QueryWithHelpers<
    HydratedDocument<Survey>[],
    HydratedDocument<Survey>,
    QueryHelpers<Survey>
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

export default SurveyQueryHelpers;
