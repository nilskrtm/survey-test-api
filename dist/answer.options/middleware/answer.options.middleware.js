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
const answer_pictures_service_1 = __importDefault(require("../../answer.pictures/services/answer.pictures.service"));
//const log: debug.IDebugger = debug('app:answer-options-controllers');
class AnswerOptionsMiddleware {
    isValidAnswerOptionOrdering(req, res, next) {
        const question = res.locals.question;
        const newSorting = req.body.ordering;
        if (question.answerOptions.length == Object.keys(newSorting).length) {
            const answerOptionsIds = question.answerOptions.map(answerOptionObject => answerOptionObject._id);
            if (answerOptionsIds.every(answerOptionsId => answerOptionsId in newSorting &&
                typeof newSorting[answerOptionsId] === 'number')) {
                const toFill = {};
                for (let order = 1; order <= question.answerOptions.length; order++) {
                    toFill[order] = null;
                }
                Object.keys(newSorting).forEach(answerOptionsId => {
                    toFill[newSorting[answerOptionsId]] = answerOptionsId;
                });
                let valid = true;
                for (let orderAsString of Object.keys(toFill)) {
                    let order = parseInt(orderAsString);
                    if (toFill[order] === null) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    return next();
                }
            }
        }
        res.status(400).send();
    }
    answerPictureToSetExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPictureId = req.body.picture;
            if (answerPictureId) {
                const answerPicture = yield answer_pictures_service_1.default.getById(answerPictureId);
                if (answerPicture && answerPicture.name && answerPicture.fileName) {
                    next();
                }
                else {
                    res.status(400).send();
                }
            }
            else {
                next();
            }
        });
    }
    validateAnswerOptionExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = res.locals.question;
            const answerOptions = question.answerOptions.filter(answerOptionObject => answerOptionObject._id === req.body.locals.answerOptionId);
            if (answerOptions.length > 0) {
                res.locals.answerOption = answerOptions[0];
                next();
            }
            else {
                res.status(404).send({
                    error: `AnswerOption ${req.params.answerOptionId} not found`,
                });
            }
        });
    }
    extractAnswerOptionId(req, res, next) {
        req.body.locals.answerOptionId = req.params.answerOptionId;
        next();
    }
}
exports.default = new AnswerOptionsMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLm9wdGlvbnMubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Fuc3dlci5vcHRpb25zL21pZGRsZXdhcmUvYW5zd2VyLm9wdGlvbnMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUlBLHFIQUEyRjtBQUUzRix1RUFBdUU7QUFFdkUsTUFBTSx1QkFBdUI7SUFDM0IsMkJBQTJCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUN6RSxNQUFNLFFBQVEsR0FBYSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUMvQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVyQyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ2pELGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQzdDLENBQUM7WUFFRixJQUNFLGdCQUFnQixDQUFDLEtBQUssQ0FDcEIsZUFBZSxDQUFDLEVBQUUsQ0FDaEIsZUFBZSxJQUFJLFVBQVU7Z0JBQzdCLE9BQU8sVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLFFBQVEsQ0FDbEQsRUFDRDtnQkFDQSxNQUFNLE1BQU0sR0FBcUMsRUFBRSxDQUFDO2dCQUVwRCxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQ25FLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3RCO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FB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