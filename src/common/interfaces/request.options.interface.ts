import { RequestPagingParams } from '../types/paging.params.type';
import { FilteringParams } from '../types/filtering.params.type';
import { SortingParams } from '../types/sorting.params.type';

export interface RequestOptions {
  paging: RequestPagingParams;
  filtering: FilteringParams;
  sorting: SortingParams;
}
