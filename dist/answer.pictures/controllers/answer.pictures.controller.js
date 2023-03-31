"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const answer_pictures_service_1 = __importDefault(require("../services/answer.pictures.service"));
const s3_service_1 = __importDefault(require("../../common/services/s3.service"));
const mime = __importStar(require("mime-types"));
const log = (0, debug_1.default)('app:answer-pictures-controller');
class AnswerPicturesController {
    listAnswerPictures(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const answerPictures = yield answer_pictures_service_1.default.list(req.body.paging, ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId));
            res.status(200).send(answerPictures);
        });
    }
    getAnswerPictureById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPicture = yield answer_pictures_service_1.default.getById(req.body.locals.answerPictureId);
            const answerPictureWithUrl = Object.assign({}, answerPicture._doc, {
                url: s3_service_1.default.getPictureURL(answerPicture.fileName),
            });
            res.status(200).send({ answerPicture: answerPictureWithUrl });
        });
    }
    createAnswerPicture(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const answerPictureId = yield answer_pictures_service_1.default.create(Object.assign(Object.assign({}, req.body), { owner: ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId) }));
            if (req.file !== undefined) {
                const fileName = answerPictureId + '.' + mime.extension(req.file.mimetype);
                try {
                    yield s3_service_1.default.uploadPicture(fileName, req.file.buffer, req.file.mimetype);
                }
                catch (err) {
                    return res.status(500);
                }
                yield answer_pictures_service_1.default.patchById(answerPictureId, {
                    fileName: fileName,
                });
            }
            log(`created new answer-picture ${answerPictureId}`);
            res.status(201).send({ id: answerPictureId });
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield answer_pictures_service_1.default.patchById(req.body.locals.answerPictureId, Object.assign(Object.assign({}, req.body), { edited: new Date() }));
            if (req.file !== undefined) {
                const fileName = req.body.locals.answerPictureId +
                    '.' +
                    mime.extension(req.file.mimetype);
                try {
                    yield s3_service_1.default.uploadPicture(fileName, req.file.buffer, req.file.mimetype);
                }
                catch (err) {
                    return res.status(500);
                }
                yield answer_pictures_service_1.default.patchById(req.body.locals.answerPictureId, {
                    fileName: fileName,
                });
            }
            log(`updated answer-picture ${req.body.locals.answerPictureId}`);
            res.status(204).send();
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield answer_pictures_service_1.default.putById(req.body.locals.answerPictureId, Object.assign(Object.assign({}, req.body), { edited: new Date() }));
            if (req.file !== undefined) {
                const fileName = req.body.locals.answerPictureId +
                    '.' +
                    mime.extension(req.file.mimetype);
                try {
                    yield s3_service_1.default.uploadPicture(fileName, req.file.buffer, req.file.mimetype);
                }
                catch (err) {
                    return res.status(500);
                }
                yield answer_pictures_service_1.default.patchById(req.body.locals.answerPictureId, {
                    fileName: fileName,
                });
            }
            log(`updated answer-picture ${req.body.locals.answerPictureId}`);
            res.status(204).send();
        });
    }
    removeAnswerPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerPicture = res.locals.answerPicture;
            if (answerPicture.fileName &&
                (yield s3_service_1.default.pictureExists(answerPicture.fileName))) {
                yield s3_service_1.default.deletePicture(answerPicture.fileName);
            }
            yield answer_pictures_service_1.default.deleteById(req.body.locals.answerPictureId);
            log(`deleted answer-picture ${req.body.locals.answerPictureId}`);
            res.status(204).send();
        });
    }
}
exports.default = new AnswerPicturesController();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnBpY3R1cmVzLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hbnN3ZXIucGljdHVyZXMvY29udHJvbGxlcnMvYW5zd2VyLnBpY3R1cmVzLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQUUxQixrR0FBd0U7QUFDeEUsa0ZBQXlEO0FBQ3pELGlEQUFtQztBQUduQyxNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUVyRSxNQUFNLHdCQUF3QjtJQUN0QixrQkFBa0IsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7O1lBQ2xELE1BQU0sY0FBYyxHQUFHLE1BQU0saUNBQXFCLENBQUMsSUFBSSxDQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDZixDQUFBLE1BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLE1BQU0sTUFBSSxNQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUywwQ0FBRSxNQUFNLENBQUEsQ0FDdkQsQ0FBQztZQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDOztLQUN0QztJQUVLLG9CQUFvQixDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxNQUFNLGFBQWEsR0FBRyxNQUFNLGlDQUFxQixDQUFDLE9BQU8sQ0FDdkQsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUNoQyxDQUFDO1lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFO2dCQUNqRSxHQUFHLEVBQUUsb0JBQVMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQzthQUNyRCxDQUFDLENBQUM7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