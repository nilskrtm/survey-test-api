"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('app:mongoose-service');
class MongooseService {
    constructor() {
        this.count = 0;
        this.mongooseOptions = {
            serverSelectionTimeoutMS: 5000,
            user: process.env.DATABASE_USER || 'username',
            pass: process.env.DATABASE_PASSWORD || 'password',
            dbName: process.env.DATABASE_DB || 'db',
        };
        this.connectWithRetry = () => {
            log('Attempting MongoDB connection (will retry if needed)');
            mongoose_1.default
                .connect('mongodb://' +
                (process.env.DATABASE_HOST || 'localhost') +
                ':' +
                (process.env.DATABASE_PORT || '27017'), this.mongooseOptions)
                .then(() => {
                log('MongoDB is connected');
            })
                .catch(err => {
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful (will retry #${++this
                    .count} after ${retrySeconds} seconds):`, err);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
        };
        this.connectWithRetry();
    }
    getMongoose() {
        return mongoose_1.default;
    }
}
exports.default = new MongooseService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi9zZXJ2aWNlcy9tb25nb29zZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWtEO0FBQ2xELGtEQUEwQjtBQUUxQixNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUUzRCxNQUFNLGVBQWU7SUFTbkI7UUFSUSxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1Ysb0JBQWUsR0FBbUI7WUFDeEMsd0JBQXdCLEVBQUUsSUFBSTtZQUM5QixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksVUFBVTtZQUM3QyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxVQUFVO1lBQ2pELE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJO1NBQ3hDLENBQUM7UUFVRixxQkFBZ0IsR0FBRyxHQUFHLEVBQUU7WUFDdEIsR0FBRyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFFNUQsa0JBQVE7aUJBQ0wsT0FBTyxDQUNOLFlBQVk7Z0JBQ1YsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxXQUFXLENBQUM7Z0JBQzFDLEdBQUc7Z0JBQ0gsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsRUFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FDckI7aUJBQ0EsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNYLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFFdkIsR0FBRyxDQUNELGdEQUFnRCxFQUFFLElBQUk7cUJBQ25ELEtBQUssVUFBVSxZQUFZLFlBQVksRUFDMUMsR0FBRyxDQUNKLENBQUM7Z0JBRUYsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFoQ0EsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLGtCQUFRLENBQUM7SUFDbEIsQ0FBQztDQTRCRjtBQUNELGtCQUFlLElBQUksZUFBZSxFQUFFLENBQUMifQ==