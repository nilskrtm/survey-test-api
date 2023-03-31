"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerSetsRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
class AnswerSetsRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'VotingsRoutes');
    }
    configureRoutes() {
        this.app.route(`/surveys/:surveyId/votings`).post((req, res) => {
            const surveyId = req.params.surveyId;
            const voting = req.body;
            console.log('New Voting for Survey ' + surveyId + ' : ' + JSON.stringify(voting));
            res.status(201).send();
        });
        return this.app;
    }
}
exports.AnswerSetsRoutes = AnswerSetsRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLnNldHMucm91dGVzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2Fuc3dlci5zZXRzL2Fuc3dlci5zZXRzLnJvdXRlcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUVBQWtFO0FBR2xFLE1BQWEsZ0JBQWlCLFNBQVEseUNBQWtCO0lBQ3RELFlBQVksR0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzdELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FDVCx3QkFBd0IsR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQ3JFLENBQUM7WUFFRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQW5CRCw0Q0FtQkMifQ==