"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_validator_1 = require("express-validator");
const common_routes_config_1 = require("../common/common.routes.config");
const body_validation_middleware_1 = __importDefault(require("../common/middleware/body.validation.middleware"));
const users_middleware_1 = __importDefault(require("./middleware/users.middleware"));
const permission_middleware_1 = __importDefault(require("../common/middleware/permission.middleware"));
const paging_middleware_1 = __importDefault(require("../common/middleware/paging.middleware"));
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
const common_permissionlevel_enum_1 = require("../common/enums/common.permissionlevel.enum");
const auth_middleware_1 = __importDefault(require("../auth/middleware/auth.middleware"));
class UsersRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'UsersRoutes');
    }
    configureRoutes() {
        this.app
            .route(`/users`)
            .get(auth_middleware_1.default.validAuthorizationNeeded(true, false), permission_middleware_1.default.permissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.ADMIN), paging_middleware_1.default.extractPagingParameters, users_controller_1.default.listUsers)
            .post(auth_middleware_1.default.validAuthorizationNeeded(true, false), permission_middleware_1.default.permissionLevelRequired(common_permissionlevel_enum_1.PermissionLevel.ADMIN), (0, express_validator_1.body)('_id').not().exists(), (0, express_validator_1.body)('username')
            .isString()
            .isLength({ min: 2, max: 20 })
            .withMessage('Der Nutzername muss zwischen 2 und 20 Zeichen lang sein.'), (0, express_validator_1.body)('firstName')
            .isString()
            .isLength({ min: 2, max: 35 })
            .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.'), (0, express_validator_1.body)('lastName')
            .isString()
            .isLength({ min: 2, max: 35 })
            .withMessage('Der Nachname muss zwischen 2 und 35 Zeichen lang sein.'), (0, express_validator_1.body)('password')
            .isLength({ min: 8, max: 40 })
            .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.'), body_validation_middleware_1.default.verifyBodyFieldsErrors, users_middleware_1.default.validateSameUsernameDoesntExist, users_controller_1.default.createUser);
        this.app.param(`userId`, users_middleware_1.default.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(auth_middleware_1.default.validAuthorizationNeeded(true, false), users_middleware_1.default.validateUserExists, permission_middleware_1.default.onlySameUserOrAdminCanDoThisAction)
            .get(users_controller_1.default.getUserById)
            .delete(users_middleware_1.default.userCantDeleteSelf, users_controller_1.default.removeUser);
        this.app.put(`/users/:userId`, [
            (0, express_validator_1.body)('_id').not().exists(),
            (0, express_validator_1.body)('username').not().exists(),
            (0, express_validator_1.body)('firstName')
                .isString()
                .isLength({ min: 2, max: 35 })
                .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.'),
            (0, express_validator_1.body)('lastName')
                .isString()
                .isLength({ min: 2, max: 35 })
                .withMessage('Der Nachname muss zwischen 2 und 35 Zeichen lang sein.'),
            (0, express_validator_1.body)('password')
                .isLength({ min: 8, max: 40 })
                .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.'),
            (0, express_validator_1.body)('permissionLevel').isInt(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.userCantChangePermission,
            users_controller_1.default.put,
        ]);
        this.app.patch(`/users/:userId`, [
            (0, express_validator_1.body)('_id').not().exists(),
            (0, express_validator_1.body)('username').not().exists(),
            (0, express_validator_1.body)('firstName')
                .isString()
                .isLength({ min: 2, max: 35 })
                .withMessage('Der Vorname muss zwischen 2 und 35 Zeichen lang sein.'),
            (0, express_validator_1.body)('lastName')
                .isString()
                .isLength({ min: 2, max: 35 })
                .withMessage('Der Nachname muss zwischen 2 und 35 Zeichen lang sein.'),
            (0, express_validator_1.body)('password')
                .isLength({ min: 8, max: 40 })
                .withMessage('Das Passwort muss zwischen 8 und 40 Zeichen lang sein.'),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.userCantChangePermission,
            users_controller_1.default.patch,
        ]);
        return this.app;
    }
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3VzZXJzL3VzZXJzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseURBQXVDO0FBQ3ZDLHlFQUFrRTtBQUNsRSxpSEFBdUY7QUFDdkYscUZBQTREO0FBQzVELHVHQUE4RTtBQUM5RSwrRkFBc0U7QUFDdEUsc0ZBQTZEO0FBQzdELDZGQUE0RTtBQUM1RSx5RkFBZ0U7QUFFaEUsTUFBYSxXQUFZLFNBQVEseUNBQWtCO0lBQ2pELFlBQVksR0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHO2FBQ0wsS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUNmLEdBQUcsQ0FDRix5QkFBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFDcEQsK0JBQW9CLENBQUMsdUJBQXVCLENBQUMsNkNBQWUsQ0FBQyxLQUFLLENBQUMsRUFDbkUsMkJBQWdCLENBQUMsdUJBQXVCLEVBQ3hDLDBCQUFlLENBQUMsU0FBUyxDQUMxQjthQUNBLElBQUksQ0FDSCx5QkFBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFDcEQsK0JBQW9CLENBQUMsdUJBQXVCLENBQUMsNkNBQWUsQ0FBQyxLQUFLLENBQUMsRUFDbkUsSUFBQSx3QkFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUMxQixJQUFBLHdCQUFJLEVBQUMsVUFBVSxDQUFDO2FBQ2IsUUFBUSxFQUFFO2FBQ1YsUUFBUSxDQUFDLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7YUFDM0IsV0FBVyxDQUNWLDBEQUEwRCxDQUMzRCxFQUNILElBQUEsd0JBQUksRUFB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