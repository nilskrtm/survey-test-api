import {Model, Query} from 'mongoose';

export abstract class DAO<T> {
  abstract getModel(): Model<T>;

  public static isCascadeRemoval(query: Query<any, any, {}, any>) {
    return (
      (query.getOptions().comment && 'cascade' in query.getOptions().comment) ||
      query.getOptions().comment.cascade === true
    );
  }
}
