"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotingsRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const auth_middleware_1 = __importDefault(require("../auth/middleware/auth.middleware"));
const express_validator_1 = require("express-validator");
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const votings_middleware_1 = __importDefault(require("./middleware/votings.middleware"));
const votings_controller_1 = __importDefault(require("./controllers/votings.controller"));
const surveys_middleware_1 = __importDefault(require("../surveys/middleware/surveys.middleware"));
const permission_middleware_1 = __importDefault(require("../common/middleware/permission.middleware"));
class VotingsRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'VotingsRoutes');
    }
    configureRoutes() {
        this.app
            .route(`/surveys/:surveyId/votings`)
            .post(auth_middleware_1.default.validAuthorizationNeeded(false, true), surveys_middleware_1.default.extractSurveyId, surveys_middleware_1.default.validateSurveyExists, permission_middleware_1.default.onlySurveyOwnerOrAdminCanDoThisAction, surveys_middleware_1.default.validateSurveyIsNoDraft, (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('date').isISO8601().toDate().exists(), (0, express_validator_1.body)('votes').isArray().exists(), body_validation_middleware_1.default.verifyBodyFieldsErrors, votings_middleware_1.default.validVoteData, votings_controller_1.default.createVoting);
        return this.app;
    }
}
exports.VotingsRoutes = VotingsRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90aW5ncy5yb3V0ZXMuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdm90aW5ncy92b3RpbmdzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUVBQWtFO0FBRWxFLHlGQUFnRTtBQUNoRSx5REFBdUM7QUFDdkMsaUhBQXVGO0FBQ3ZGLHlGQUFnRTtBQUNoRSwwRkFBaUU7QUFDakUsa0dBQXlFO0FBQ3pFLHVHQUE4RTtBQUU5RSxNQUFhLGFBQWMsU0FBUSx5Q0FBa0I7SUFDbkQsWUFBWSxHQUFnQjtRQUMxQixLQUFLLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsNEJBQTRCLENBQUM7YUFDbkMsSUFBSSxDQUNILHlCQUFjLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUNwRCw0QkFBaUIsQ0FBQyxlQUFlLEVBQ2pDLDRCQUFpQixDQUFDLG9CQUFvQixFQUN0QywrQkFBb0IsQ0FBQyxxQ0FBcUMsRUFDMUQsNEJBQWlCLENBQUMsdUJBQXVCLEVBQ3pDLElBQUEsd0JBQUksRUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFDMUIsSUFBQSx3QkFBSSxFQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUMxQyxJQUFBLHdCQUFJLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQ2hDLG9DQUF3QixDQUFDLHNCQUFzQixFQUMvQyw0QkFBaUIsQ0FBQyxhQUFhLEVBQy9CLDRCQUFpQixDQUFDLFlBQVksQ0FDL0IsQ0FBQztRQUVKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUF4QkQsc0NBd0JDIn0=