type RequestPagingParams = {
  perPage: number;
  page: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PagingParams = RequestPagingParams & {
  lastPage: number;
  offset?: number;
  count: number;
};
