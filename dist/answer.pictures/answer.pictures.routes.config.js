"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerPicturesRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const auth_middleware_1 = __importDefault(require("../auth/middleware/auth.middleware"));
const paging_middleware_1 = __importDefault(require("../common/middleware/paging.middleware"));
const answer_pictures_controller_1 = __importDefault(require("./controllers/answer.pictures.controller"));
const answer_pictures_middleware_1 = __importDefault(require("./middleware/answer.pictures.middleware"));
const express_validator_1 = require("express-validator");
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const permission_middleware_1 = __importDefault(require("../common/middleware/permission.middleware"));
const multer_1 = __importDefault(require("multer"));
class AnswerPicturesRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'AnswerPicturesRoutes');
    }
    configureRoutes() {
        this.app
            .route(`/answer-pictures`)
            .get(auth_middleware_1.default.validAuthorizationNeeded(true, false), paging_middleware_1.default.extractPagingParameters, answer_pictures_controller_1.default.listAnswerPictures)
            .post(auth_middleware_1.default.validAuthorizationNeeded(true, false), (0, multer_1.default)().single('file'), (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('name')
            .isString()
            .isLength({ min: 1, max: 50 })
            .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('fileName').not().exists(), (0, express_validator_1.body)('owner').not().exists(), (0, express_validator_1.body)('created').not().exists(), (0, express_validator_1.body)('edited').not().exists(), body_validation_middleware_1.default.verifyBodyFieldsErrors, answer_pictures_middleware_1.default.validateFormDataPictureValid, answer_pictures_controller_1.default.createAnswerPicture);
        this.app.param(`answerPictureId`, answer_pictures_middleware_1.default.extractAnswerPictureId);
        this.app
            .route(`/answer-pictures/:answerPictureId`)
            .get(auth_middleware_1.default.validAuthorizationNeeded(true, true), answer_pictures_middleware_1.default.validateAnswerPictureExists, permission_middleware_1.default.onlyAnswerPictureOwnerOrAdminCanDoThisAction, answer_pictures_controller_1.default.getAnswerPictureById);
        this.app
            .route(`/answer-pictures/:answerPictureId`)
            .delete(auth_middleware_1.default.validAuthorizationNeeded(true, false), answer_pictures_middleware_1.default.validateAnswerPictureExists, permission_middleware_1.default.onlyAnswerPictureOwnerOrAdminCanDoThisAction, answer_pictures_middleware_1.default.validateAnswerPictureNotUsed, answer_pictures_controller_1.default.removeAnswerPicture);
        this.app.route(`/answer-pictures/:answerPictureId`).put(auth_middleware_1.default.validAuthorizationNeeded(true, false), answer_pictures_middleware_1.default.validateAnswerPictureExists, permission_middleware_1.default.onlyAnswerPictureOwnerOrAdminCanDoThisAction, answer_pictures_middleware_1.default.validateAnswerPictureNotUsed, (0, multer_1.default)().single('file'), body_validation_middleware_1.default.verifyLocalsInBody, // needed because of multer
        answer_pictures_middleware_1.default.extractAnswerPictureId, // needed because of multer
        (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('name')
            .isString()
            .isLength({ min: 1, max: 50 })
            .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('fileName').not().exists(), (0, express_validator_1.body)('owner').not().exists(), (0, express_validator_1.body)('created').not().exists(), (0, express_validator_1.body)('edited').not().exists(), body_validation_middleware_1.default.verifyBodyFieldsErrors, answer_pictures_middleware_1.default.validateFormDataPictureValid, answer_pictures_controller_1.default.put);
        this.app.route(`/answer-pictures/:answerPictureId`).patch(auth_middleware_1.default.validAuthorizationNeeded(true, false), answer_pictures_middleware_1.default.validateAnswerPictureExists, permission_middleware_1.default.onlyAnswerPictureOwnerOrAdminCanDoThisAction, answer_pictures_middleware_1.default.validateAnswerPictureNotUsed, (0, multer_1.default)().single('file'), body_validation_middleware_1.default.verifyLocalsInBody, // needed because of multer
        answer_pictures_middleware_1.default.extractAnswerPictureId, // needed because of multer
        (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('name')
            .isString()
            .isLength({ min: 1, max: 50 })
            .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('fileName').not().exists(), (0, express_validator_1.body)('owner').not().exists(), (0, express_validator_1.body)('created').not().exists(), (0, express_validator_1.body)('edited').not().exists(), body_validation_middleware_1.default.verifyBodyFieldsErrors, answer_pictures_middleware_1.default.validateFormDataPictureValid, answer_pictures_controller_1.default.patch);
        return this.app;
    }
}
exports.AnswerPicturesRoutes = AnswerPicturesRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnBpY3R1cmVzLnJvdXRlcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9hbnN3ZXIucGljdHVyZXMvYW5zd2VyLnBpY3R1cmVzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseUVBQWtFO0FBQ2xFLHlGQUFnRTtBQUNoRSwrRkFBc0U7QUFDdEUsMEdBQWdGO0FBQ2hGLHlHQUErRTtBQUMvRSx5REFBdUM7QUFDdkMsaUhBQXVGO0FBQ3ZGLHVHQUE4RTtBQUM5RSxvREFBNEI7QUFFNUIsTUFBYSxvQkFBcUIsU0FBUSx5Q0FBa0I7SUFDMUQsWUFBWSxHQUFnQjtRQUMxQixLQUFLLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQzthQUN6QixHQUFHLENBQ0YseUJBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQ3BELDJCQUFnQixDQUFDLHVCQUF1QixFQUN4QyxvQ0FBd0IsQ0FBQyxrQkFBa0IsQ0FDNUM7YUFDQSxJQUFJLENBQ0gseUJBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQ3BELElBQUEsZ0JBQU0sR0FBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFDdkIsSUFBQSx3QkFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUMxQixJQUFBLHdCQUFJLEVBQUMsTUFBTSxDQUFDO2FBQ1QsUUFBUSxFQUFFO2FBQ1YsUUFBUSxDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7YUFDM0IsV0FBVyxDQUFDLG9EQUFvRCxDQUFDO2FBQ2pFLFFBQVEsRUFBRSxFQUNiLElBQUEsd0JBQUksRUFB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