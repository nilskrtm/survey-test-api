import { HydratedDocument, QueryWithHelpers } from 'mongoose';
import { FilteringParams } from '../types/filtering.params.type';
import { SortingParams } from '../types/sorting.params.type';

export interface QueryHelpers<T> {
  applyFiltering(
    filterParams: FilteringParams,
  ): QueryWithHelpers<
    HydratedDocument<T>[],
    HydratedDocument<T>,
    QueryHelpers<T>
  >;

  applySorting(
    sortingParams: SortingParams,
  ): QueryWithHelpers<
    HydratedDocument<T>[],
    HydratedDocument<T>,
    QueryHelpers<T>
  >;
}
