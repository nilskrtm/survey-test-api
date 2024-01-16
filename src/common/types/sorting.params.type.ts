import { SortOrder } from 'mongoose';

export type SortingParams = {
  sortingOption: string;
  sortingType: SortOrder;
};
