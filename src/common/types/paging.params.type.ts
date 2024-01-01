export type RequestPagingParams = {
  perPage: number;
  page: number;
};

export type PagingParams = RequestPagingParams & {
  lastPage: number;
  offset?: number;
  count: number;
};
