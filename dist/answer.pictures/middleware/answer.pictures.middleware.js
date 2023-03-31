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
const surveys_dao_1 = __importDefault(require("../../surveys/daos/surveys.dao"));
//const log: debug.IDebugger = debug('app:answer-pictures-controllers');
class AnswerPicturesMiddleware {
    validateAnswerPictureNotUsed(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPicture = res.locals.answerPicture;
            const result = yield surveys_dao_1.default.getModel()
                .aggregate([
                {
                    $match: {
                        draft: false,
                    },
                },
                {
                    $lookup: {
                        from: 'questions',
                        localField: 'questions',
                        foreignField: '_id',
                        as: 'questionObjects',
                    },
                },
                {
                    $unwind: {
                        path: '$questionObjects',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'answer_options',
                        localField: 'questionObjects.answerOptions',
                        foreignField: '_id',
                        as: 'answerOptions',
                    },
                },
                {
                    $unwind: {
                        path: '$answerOptions.picture',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'answerOptions.picture': answerPicture._id,
                        draft: false,
                    },
                },
                {
                    $count: 'count',
                },
            ])
                .exec();
            if (result.length === 0 ||
                ('count' in result[0] && result[0].count === 0)) {
                next();
            }
            else {
                res.status(404).send({
                    error: `AnswerPicture ${req.params.answerPictureId} in use can not be edited`,
                });
            }
        });
    }
    validateFormDataPictureValid(req, res, next) {
        const picture = req.file;
        if (picture !== undefined) {
            const allowedMimeTypes = (process.env.ALLOWED_MIME_TYPES || '').split(';');
            if (allowedMimeTypes.includes(picture.mimetype)) {
                next();
            }
            else {
                res.status(400).send({
                    error: `Picture has invalid mime-type`,
                });
            }
        }
        else {
            next();
        }
    }
    validateAnswerPictureExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPicture = yield answer_pictures_service_1.default.getById(req.body.locals.answerPictureId);
            if (answerPicture) {
                res.locals.answerPicture = answerPicture;
                next();
            }
            else {
                res.status(404).send({
                    error: `AnswerPicture ${req.params.answerPictureId} not found`,
                });
            }
        });
    }
    extractAnswerPictureId(req, res, next) {
        req.body.locals.answerPictureId = req.params.answerPictureId;
        next();
    }
}
exports.default = new AnswerPicturesMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnBpY3R1cmVzLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hbnN3ZXIucGljdHVyZXMvbWlkZGxld2FyZS9hbnN3ZXIucGljdHVyZXMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLHFIQUEyRjtBQUMzRixpRkFBd0Q7QUFFeEQsd0VBQXdFO0FBRXhFLE1BQU0sd0JBQXdCO0lBQ3RCLDRCQUE0QixDQUNoQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCOztZQUVsQixNQUFNLGFBQWEsR0FBa0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7WUFDOUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxxQkFBVSxDQUFDLFFBQVEsRUFBRTtpQkFDdkMsU0FBUyxDQUFDO2dCQUNUO29CQUNFLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsS0FBSztxQkFDYjtpQkFDRjtnQkFDRDtvQkFDRSxPQUFPLEVBQUU7d0JBQ1AsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLFVBQVUsRUFBRSxXQUFXO3dCQUN2QixZQUFZLEVBQUUsS0FBSzt3QkFDbkIsRUFBRSxFQUFFLGlCQUFpQjtxQkFDdEI7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFO3dCQUNQLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLDBCQUEwQixFQUFFLElBQUk7cUJBQ2pDO2lCQUNGO2dCQUNEO29CQUNFLE9BQU8sRUFBRTt3QkFDUCxJQUFJLEVBQUUsZ0JBQWdCO3dCQUN0QixVQUFVLEVBQUUsK0JBQStCO3dCQUMzQyxZQUFZLEVBQUUsS0FBSzt3QkFDbkIsRUFBRSxFQUFFLGVBQWU7cUJBQ3BCO2lCQUNGO2dCQUNEO29CQUNFLE9BQU8sRUFBRTt3QkFDUCxJQUFJLEVBQUUsd0JBQXdCO3dCQUM5QiwwQkFBMEIsRUFBRSxJQUFJO3FCQUNqQztpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUU7d0JBQ04sdUJBQXVCLEVBQUUsYUFBYSxDQUFDLEdBQUc7d0JBQzFDLEtBQUssRUFBRSxLQUFLO3FCQUNiO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxPQUFPO2lCQUNoQjthQUNGLENBQUM7aUJBQ0QsSUFBSSxFQUFFLENBQUM7WUFFVixJQUNFLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDbkIsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQy9DO2dCQUNBLElBQUksRUFBRSxDQUFDO2FBQ1I7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLEtBQUssRUFBRSxpQkFBaUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLDJCQUEyQjtpQkFDOUUsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDO0tBQUE7SUFFRCw0QkFBNEIsQ0FDMUIsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtRQUVsQixNQUFNLE9BQU8sR0FBb0MsR0FBRyxDQUFDLElBQUksQ0FBQztRQUUxRCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDekIsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUNuRSxHQUFHLENBQ0osQ0FBQztZQUVGLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxFQUFFLENBQUM7YUFDUjtpQkFBTTtnQkFDTCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsS0FBSyxFQUFFLCtCQUErQjtpQkFDdkMsQ0FBQyxDQUFDO2FBQ0o7U0FDRjthQUFNO1lBQ0wsSUFBSSxFQUFFLENBQUM7U0FDUjtJQUNILENBQUM7SUFFSywyQkFBMkIsQ0FDL0IsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjs7WUFFbEIsTUFBTSxhQUFhLEdBQWtCLE1BQU0saUNBQXFCLENBQUMsT0FBTyxDQUN0RSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQ2hDLENBQUM7WUFFRixJQUFJLGFBQWEsRUFBRTtnQkFDakIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO2dCQUV6QyxJQUFJLEVBQUUsQ0FBQzthQUNSO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNuQixLQUFLLEVBQUUsaUJBQWlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxZQUFZO2lCQUMvRCxDQUFDLENBQUM7YUFDSjtRQUNILENBQUM7S0FBQTtJQUVELHNCQUFzQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDcEUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBRTdELElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSx3QkFBd0IsRUFBRSxDQUFDIn0=