"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CombinerMiddleware {
    combine(middlewares) {
        return middlewares.reduce(function (a, b) {
            return function (req, res, next) {
                a(req, res, function (err) {
                    if (err) {
                        return next(err);
                    }
                    b(req, res, next);
                });
            };
        });
    }
}
exports.default = new CombinerMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZXIubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi9taWRkbGV3YXJlL2NvbWJpbmVyLm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLGtCQUFrQjtJQUN0QixPQUFPLENBQUMsV0FBNkI7UUFDbkMsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDdEMsT0FBTyxVQUFVLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7Z0JBQzlELENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsR0FBUTtvQkFDNUIsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2xCO29CQUVELENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNwQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxrQkFBa0IsRUFBRSxDQUFDIn0=