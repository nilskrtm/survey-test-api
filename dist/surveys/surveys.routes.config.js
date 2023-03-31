"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveysRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const permission_middleware_1 = __importDefault(require("../common/middleware/permission.middleware"));
const surveys_middleware_1 = __importDefault(require("../surveys/middleware/surveys.middleware"));
const surveys_controller_1 = __importDefault(require("./controllers/surveys.controller"));
const express_validator_1 = require("express-validator");
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const paging_middleware_1 = __importDefault(require("../common/middleware/paging.middleware"));
const auth_middleware_1 = __importDefault(require("../auth/middleware/auth.middleware"));
class SurveysRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'SurveysRoutes');
    }
    configureRoutes() {
        this.app
            .route(`/surveys`)
            .get(auth_middleware_1.default.validAuthorizationNeeded(true, true), paging_middleware_1.default.extractPagingParameters, surveys_controller_1.default.listSurveys)
            .post(auth_middleware_1.default.validAuthorizationNeeded(true, false), (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('name')
            .isString()
            .isLength({ min: 1, max: 50 })
            .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('description')
            .isString()
            .isLength({ min: 1, max: 150 })
            .withMessage('Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('greeting')
            .isString()
            .isLength({ min: 1, max: 300 })
            .withMessage('Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.')
            .optional(), (0, express_validator_1.body)('startDate').not().exists(), (0, express_validator_1.body)('endDate').not().exists(), (0, express_validator_1.body)('owner').not().exists(), (0, express_validator_1.body)('created').not().exists(), (0, express_validator_1.body)('edited').not().exists(), (0, express_validator_1.body)('draft').not().exists(), (0, express_validator_1.body)('archived').not().exists(), (0, express_validator_1.body)('questions').not().exists(), body_validation_middleware_1.default.verifyBodyFieldsErrors, surveys_controller_1.default.createSurvey);
        this.app.param(`surveyId`, surveys_middleware_1.default.extractSurveyId);
        this.app
            .route(`/surveys/:surveyId`)
            .get(auth_middleware_1.default.validAuthorizationNeeded(true, true), surveys_middleware_1.default.validateSurveyExists, permission_middleware_1.default.onlySurveyOwnerOrAdminCanDoThisAction, surveys_controller_1.default.getSurveyById);
        this.app
            .route(`/surveys/:surveyId`)
            .delete(auth_middleware_1.default.validAuthorizationNeeded(true, false), surveys_middleware_1.default.validateSurveyExists, permission_middleware_1.default.onlySurveyOwnerOrAdminCanDoThisAction, surveys_controller_1.default.removeSurvey);
        this.app.route(`/surveys/:surveyId`).put(auth_middleware_1.default.validAuthorizationNeeded(true, false), surveys_middleware_1.default.validateSurveyExists, permission_middleware_1.default.onlySurveyOwnerOrAdminCanDoThisAction, (0, express_validator_1.oneOf)([
            [
                (0, express_validator_1.body)('_id').not().exists(),
                (0, express_validator_1.body)('name').not().exists(),
                (0, express_validator_1.body)('greeting').not().exists(),
                (0, express_validator_1.body)('description').not().exists(),
                (0, express_validator_1.body)('owner').not().exists(),
                (0, express_validator_1.body)('created').not().exists(),
                (0, express_validator_1.body)('edited').not().exists(),
                (0, express_validator_1.body)('draft')
                    .isBoolean({ strict: true })
                    .custom(value => value === false)
                    .exists(),
                (0, express_validator_1.body)('archived').not().exists(),
                (0, express_validator_1.body)('questions').not().exists(),
            ],
            [
                (0, express_validator_1.body)('_id').not().exists(),
                (0, express_validator_1.body)('name')
                    .isString()
                    .isLength({ min: 1, max: 50 })
                    .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('description')
                    .isString()
                    .isLength({ min: 1, max: 150 })
                    .withMessage('Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('greeting')
                    .isString()
                    .isLength({ min: 1, max: 300 })
                    .withMessage('Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('startDate').isISO8601().toDate().optional(),
                (0, express_validator_1.body)('endDate').isISO8601().toDate().optional(),
                (0, express_validator_1.body)('owner').not().exists(),
                (0, express_validator_1.body)('created').not().exists(),
                (0, express_validator_1.body)('edited').not().exists(),
                (0, express_validator_1.body)('draft').not().exists(),
                (0, express_validator_1.body)('archived').isBoolean().optional(),
                (0, express_validator_1.body)('questions').not().exists(),
            ],
        ]), body_validation_middleware_1.default.verifyBodyFieldsErrors, surveys_middleware_1.default.validateSurveyModifiable, surveys_middleware_1.default.validateSetStartEndDates, surveys_middleware_1.default.validateSurveyFinalizable, surveys_controller_1.default.put);
        this.app.route(`/surveys/:surveyId`).patch(auth_middleware_1.default.validAuthorizationNeeded(true, false), surveys_middleware_1.default.validateSurveyExists, permission_middleware_1.default.onlySurveyOwnerOrAdminCanDoThisAction, (0, express_validator_1.oneOf)([
            [
                (0, express_validator_1.body)('_id').not().exists(),
                (0, express_validator_1.body)('name').not().exists(),
                (0, express_validator_1.body)('description').not().exists(),
                (0, express_validator_1.body)('greeting').not().exists(),
                (0, express_validator_1.body)('owner').not().exists(),
                (0, express_validator_1.body)('created').not().exists(),
                (0, express_validator_1.body)('edited').not().exists(),
                (0, express_validator_1.body)('draft')
                    .isBoolean({ strict: true })
                    .custom(value => value === false)
                    .exists(),
                (0, express_validator_1.body)('archived').not().exists(),
                (0, express_validator_1.body)('questions').not().exists(),
            ],
            [
                (0, express_validator_1.body)('_id').not().exists(),
                (0, express_validator_1.body)('name')
                    .isString()
                    .isLength({ min: 1, max: 50 })
                    .withMessage('Der Name muss zwischen 1 und 50 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('description')
                    .isString()
                    .isLength({ min: 1, max: 150 })
                    .withMessage('Die Beschreibung muss zwischen 1 und 150 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('greeting')
                    .isString()
                    .isLength({ min: 1, max: 300 })
                    .withMessage('Die Begrüßung muss zwischen 1 und 300 Zeichen lang sein.')
                    .optional(),
                (0, express_validator_1.body)('startDate').isISO8601().toDate().optional(),
                (0, express_validator_1.body)('endDate').isISO8601().toDate().optional(),
                (0, express_validator_1.body)('owner').not().exists(),
                (0, express_validator_1.body)('created').not().exists(),
                (0, express_validator_1.body)('edited').not().exists(),
                (0, express_validator_1.body)('draft').not().exists(),
                (0, express_validator_1.body)('archived').isBoolean().optional(),
                (0, express_validator_1.body)('questions').not().exists(),
            ],
        ]), body_validation_middleware_1.default.verifyBodyFieldsErrors, surveys_middleware_1.default.validateSurveyModifiable, surveys_middleware_1.default.validateSetStartEndDates, surveys_middleware_1.default.validateSurveyFinalizable, surveys_controller_1.default.patch);
        return this.app;
    }
}
exports.SurveysRoutes = SurveysRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VydmV5cy5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3VydmV5cy9zdXJ2ZXlzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseUVBQWtFO0FBQ2xFLHVHQUE4RTtBQUM5RSxrR0FBeUU7QUFDekUsMEZBQWlFO0FBQ2pFLHlEQUE4QztBQUM5QyxpSEFBdUY7QUFDdkYsK0ZBQXNFO0FBQ3RFLHlGQUFnRTtBQUVoRSxNQUFhLGFBQWMsU0FBUSx5Q0FBa0I7SUFDbkQsWUFBWSxHQUFnQjtRQUMxQixLQUFLLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsVUFBVSxDQUFDO2FBQ2pCLEdBQUcsQ0FDRix5QkFBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFDbkQsMkJBQWdCLENBQUMsdUJBQXVCLEVBQ3hDLDRCQUFpQixDQUFDLFdBQVcsQ0FDOUI7YUFDQSxJQUFJLENBQ0gseUJBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQ3BELElBQUEsd0JBQUksRUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFDMUIsSUFBQSx3QkFBSSxFQUFDLE1BQU0sQ0FBQzthQUNULFFBQVEsRUFBRTthQUNWLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQzNCLFdBQVcsQ0FBQyxvREFBb0QsQ0FBQzthQUNqRSxRQUFRLEVBQUUsRUFDYixJQUFBLHdCQUFJLEVBQUMsYUFBYSxDQUFDO2FBQ2hCLFFBQVEsRUFBRTthQUNWLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFD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