import { RequestPagingParams } from '../types/paging.params.type';

export interface CRUD {
  list: (paging: RequestPagingParams, parentId?: any) => Promise<any>;
  create: (resource: any) => Promise<any>;
  putById: (id: string, resource: any) => Promise<any>;
  getById: (id: string) => Promise<any>;
  deleteById: (id: string) => Promise<any>;
  patchById: (id: string, resource: any) => Promise<any>;
}
