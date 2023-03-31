"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const dao_class_1 = require("../../common/classes/dao.class");
const mongoose_1 = require("mongoose");
const mongoose_service_1 = __importDefault(require("../../common/services/mongoose.service"));
const uuid_1 = require("uuid");
const log = (0, debug_1.default)('app:votings-dao');
const defaultVotingValues = {};
class VotingsDAO extends dao_class_1.DAO {
    constructor() {
        super();
        this.voteSchema = new mongoose_1.Schema({
            question: { type: String, ref: 'Question' },
            answerOption: { type: String, ref: 'AnswerOption' },
        }, { _id: false });
        this.votingSchema = new mongoose_1.Schema({
            _id: String,
            survey: { type: String, ref: 'Survey' },
            date: Date,
            votes: [this.voteSchema],
        }, { id: false, collection: 'votings', versionKey: false });
        this.VotingModel = mongoose_service_1.default
            .getMongoose()
            .model('Voting', this.votingSchema);
        log('Created new instance of VotingsDao');
    }
    getModel() {
        return this.VotingModel;
    }
    addVoting(votingFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const votingId = (0, uuid_1.v4)();
            const voting = new this.VotingModel(Object.assign(Object.assign({ _id: votingId }, defaultVotingValues), votingFields));
            yield voting.save();
            return votingId;
        });
    }
    /*
    async getVotings(paging: RequestPagingParams) {
      const count = (await this.VotingModel.find().exec()).length;
      const pagingParams: PagingParams = PagingMiddleware.calculatePaging(
        paging,
        count,
      );
  
      const votings = await this.VotingModel.find()
        .limit(pagingParams.perPage)
        .skip(pagingParams.offset || 0)
        .exec();
  
      delete pagingParams.offset;
  
      return {
        votings: votings,
        paging: pagingParams,
      };
    }
    */
    removeVotingsOfSurvey(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.VotingModel.findOneAndRemove({
                survey: surveyId,
            }).exec();
        });
    }
}
exports.default = new VotingsDAO();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90aW5ncy5kYW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi92b3RpbmdzL2Rhb3Mvdm90aW5ncy5kYW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQW1EO0FBQ25ELHVDQUF1QztBQUN2Qyw4RkFBcUU7QUFDckUsK0JBQWdDO0FBR2hDLE1BQU0sR0FBRyxHQUFvQixJQUFBLGVBQUssRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBY3RELE1BQU0sbUJBQW1CLEdBQW9CLEVBQUUsQ0FBQztBQUVoRCxNQUFNLFVBQVcsU0FBUSxlQUFXO0lBdUJsQztRQUNFLEtBQUssRUFBRSxDQUFDO1FBdkJWLGVBQVUsR0FBRyxJQUFJLGlCQUFNLENBQ3JCO1lBQ0UsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFDO1lBQ3pDLFlBQVksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBQztTQUNsRCxFQUNELEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQyxDQUNiLENBQUM7UUFFRixpQkFBWSxHQUFHLElBQUksaUJBQU0sQ0FDdkI7WUFDRSxHQUFHLEVBQUUsTUFBTTtZQUNYLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBQztZQUNyQyxJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDekIsRUFDRCxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQ3RELENBQUM7UUFFRixnQkFBVyxHQUFHLDBCQUFlO2FBQzFCLFdBQVcsRUFBRTthQUNiLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBS3BDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFSyxTQUFTLENBQUMsWUFBNkI7O1lBQzNDLE1BQU0sUUFBUSxHQUFHLElBQUEsU0FBSSxHQUFFLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVywrQkFDakMsR0FBRyxFQUFFLFFBQVEsSUFDVixtQkFBbUIsR0FDbkIsWUFBWSxFQUNmLENBQUM7WUFFSCxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVwQixPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO0tBQUE7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFvQkU7SUFFSSxxQkFBcUIsQ0FBQyxRQUFnQjs7WUFDMUMsT0FBTyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzdDLE1BQU0sRUFBRSxRQUFRO2FBQ2pCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtDQUNGO0FBRUQsa0JBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQyJ9