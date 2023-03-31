"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class BodyValidationMiddleware {
    verifyBodyFieldsErrors(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            return res.status(400).send({ errors: errors.mapped() });
        }
        next();
    }
    verifyLocalsInBody(req, res, next) {
        if (!('locals' in req.body)) {
            req.body.locals = {};
        }
        next();
    }
}
exports.default = new BodyValidationMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS52YWxpZGF0aW9uLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24vbWlkZGxld2FyZS9ib2R5LnZhbGlkYXRpb24ubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlEQUFtRDtBQUVuRCxNQUFNLHdCQUF3QjtJQUM1QixzQkFBc0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQ3BFLE1BQU0sTUFBTSxHQUFHLElBQUEsb0NBQWdCLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsQ0FBQztTQUN4RDtRQUVELElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQztJQUVELGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDaEUsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFFRCxJQUFJLEVBQUUsQ0FBQztJQUNULENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksd0JBQXdCLEVBQUUsQ0FBQyJ9