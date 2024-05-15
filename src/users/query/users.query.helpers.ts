import { FilterQuery, HydratedDocument, QueryWithHelpers } from 'mongoose';
import { User } from '../daos/users.dao';
import { QueryHelpers } from '../../common/interfaces/query.helpers.interface';
import { FilteringParams } from '../../common/types/filtering.params.type';
import { SortingParams } from '../../common/types/sorting.params.type';

export interface IUserQueryHelpers extends QueryHelpers<User> {}

const UserQueryHelpers: IUserQueryHelpers = {
  applyFiltering(
    this: QueryWithHelpers<
      HydratedDocument<User>[],
      HydratedDocument<User>,
      IUserQueryHelpers
    >,
    filterParams: FilteringParams,
  ): QueryWithHelpers<
    HydratedDocument<User>[],
    HydratedDocument<User>,
    QueryHelpers<User>
  > {
    const filter: FilterQuery<User> = {};

    if ('keyword' in filterParams) {
      filter.username = {
        $regex: '.*' + filterParams.keyword + '.*',
        $options: 'i',
      };
    }

    return this.find(filter);
  },
  applySorting(
    this: QueryWithHelpers<
      HydratedDocument<User>[],
      HydratedDocument<User>,
      IUserQueryHelpers
    >,
    sortingParams?: SortingParams,
  ): QueryWithHelpers<
    HydratedDocument<User>[],
    HydratedDocument<User>,
    QueryHelpers<User>
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

export default UserQueryHelpers;
