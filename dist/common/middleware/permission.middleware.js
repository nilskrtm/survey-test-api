"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_permissionlevel_enum_1 = require("../enums/common.permissionlevel.enum");
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('app:common-permission-middleware');
class PermissionMiddleware {
    permissionLevelRequired(requiredPermissionLevel) {
        return (req, res, next) => {
            var _a, _b;
            try {
                const userPermissionLevel = parseInt(((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.permissionLevel) ||
                    ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.permissionLevel));
                if (userPermissionLevel === requiredPermissionLevel) {
                    next();
                }
                else {
                    res.status(403).send();
                }
            }
            catch (e) {
                log(e);
            }
        };
    }
    onlySameUserOrAdminCanDoThisAction(req, res, next) {
        var _a, _b, _c, _d;
        const userId = ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId);
        const userPermissionLevel = parseInt(((_c = res.locals.jwt) === null || _c === void 0 ? void 0 : _c.permissionLevel) || ((_d = res.locals.basicAuth) === null || _d === void 0 ? void 0 : _d.permissionLevel));
        if (req.params && req.params.userId && req.params.userId === userId) {
            return next();
        }
        else {
            if (userPermissionLevel === common_permissionlevel_enum_1.PermissionLevel.ADMIN) {
                return next();
            }
            else {
                return res.status(403).send();
            }
        }
    }
    onlySurveyOwnerOrAdminCanDoThisAction(req, res, next) {
        var _a, _b, _c, _d;
        const survey = res.locals.survey;
        const userId = ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId);
        if (survey.owner === userId) {
            next();
        }
        else {
            const userPermissionLevel = parseInt(((_c = res.locals.jwt) === null || _c === void 0 ? void 0 : _c.permissionLevel) ||
                ((_d = res.locals.basicAuth) === null || _d === void 0 ? void 0 : _d.permissionLevel));
            if (userPermissionLevel === common_permissionlevel_enum_1.PermissionLevel.ADMIN) {
                next();
            }
            else {
                res.status(403).send();
            }
        }
    }
    onlyAnswerPictureOwnerOrAdminCanDoThisAction(req, res, next) {
        var _a, _b, _c, _d;
        const answerPicture = res.locals.answerPicture;
        const userId = ((_a = res.locals.jwt) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = res.locals.basicAuth) === null || _b === void 0 ? void 0 : _b.userId);
        if (answerPicture.owner === userId) {
            next();
        }
        else {
            const userPermissionLevel = parseInt(((_c = res.locals.jwt) === null || _c === void 0 ? void 0 : _c.permissionLevel) ||
                ((_d = res.locals.basicAuth) === null || _d === void 0 ? void 0 : _d.permissionLevel));
            if (userPermissionLevel === common_permissionlevel_enum_1.PermissionLevel.ADMIN) {
                next();
            }
            else {
                res.status(403).send();
            }
        }
    }
}
const commonPermissionMiddleware = new PermissionMiddleware();
exports.default = commonPermissionMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbi5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uL21pZGRsZXdhcmUvcGVybWlzc2lvbi5taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esc0ZBQXFFO0FBQ3JFLGtEQUEwQjtBQUcxQixNQUFNLEdBQUcsR0FBb0IsSUFBQSxlQUFLLEVBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUV2RSxNQUFNLG9CQUFvQjtJQUN4Qix1QkFBdUIsQ0FBQyx1QkFBd0M7UUFDOUQsT0FBTyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFOztZQUN6RCxJQUFJO2dCQUNGLE1BQU0sbUJBQW1CLEdBQUcsUUFBUSxDQUNsQyxDQUFBLE1BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLGVBQWU7cUJBQzdCLE1BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLDBDQUFFLGVBQWUsQ0FBQSxDQUN4QyxDQUFDO2dCQUVGLElBQUksbUJBQW1CLEtBQUssdUJBQXVCLEVBQUU7b0JBQ25ELElBQUksRUFBRSxDQUFDO2lCQUNSO3FCQUFNO29CQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3hCO2FBQ0Y7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDUjtRQUNILENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxrQ0FBa0MsQ0FDaEMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjs7UUFFbEIsTUFBTSxNQUFNLEdBQUcsQ0FBQSxNQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRywwQ0FBRSxNQUFNLE1BQUksTUFBQSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsMENBQUUsTUFBTSxDQUFBLENBQUM7UUFDdEUsTUFBTSxtQkFBbUIsR0FBRyxRQUFR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