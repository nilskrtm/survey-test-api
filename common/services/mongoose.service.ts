import mongoose, {ConnectOptions} from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
  private count = 0;
  private mongooseOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    user: process.env.DATABASE_USER || 'username',
    pass: process.env.DATABASE_PASSWORD || 'password',
    dbName: process.env.DATABASE_DB || 'db',
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)');

    mongoose
      .connect(
        'mongodb://' +
          (process.env.DATABASE_HOST || 'localhost') +
          ':' +
          (process.env.DATABASE_PORT || '27017'),
        this.mongooseOptions,
      )
      .then(() => {
        log('MongoDB is connected');
      })
      .catch(err => {
        const retrySeconds = 5;

        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err,
        );

        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}
export default new MongooseService();
