import { RequestOptions } from './request.options.interface';

export interface CRUD {
  list: (options: RequestOptions, parentId?: any) => Promise<any>;
  create: (resource: any) => Promise<any>;
  putById: (id: string, resource: any) => Promise<any>;
  getById: (id: string) => Promise<any>;
  deleteById: (id: string) => Promise<any>;
  patchById: (id: string, resource: any) => Promise<any>;
}
