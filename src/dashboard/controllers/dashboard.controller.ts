import { Request, Response } from 'express';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import AnswerPicturesDAO from '../../answer.pictures/daos/answer.pictures.dao';
import VotingsDao from '../../votings/daos/votings.dao';
import UsersDao from '../../users/daos/users.dao';
import { PermissionLevel } from '../../common/enums/common.permissionlevel.enum';

// const log: debug.IDebugger = debug('app:dashboard-controller');

class DashboardController {
  async getDashboardMetrics(req: Request, res: Response) {
    const userId = res.locals.jwt?.userId || res.locals.basicAuth?.userId;
    const user = await UsersDao.getUserById(userId);
    const surveyCount = await SurveysDAO.getSurveyCountOfOwner(userId);
    const votingCount = await VotingsDao.getVotingCountOfUser(userId);
    const pictureCount =
      await AnswerPicturesDAO.getAnswerPictureCountOfUser(userId);

    const response: {
      metrics: {
        surveyCount: number;
        votingCount: number;
        pictureCount: number;
        userCount?: number;
      };
    } = {
      metrics: {
        surveyCount: surveyCount,
        votingCount: votingCount,
        pictureCount: pictureCount,
      },
    };

    if (user && user.permissionLevel === PermissionLevel.ADMIN) {
      response.metrics.userCount = await UsersDao.getModel().find().count();
    }

    res.status(200).send(response);
  }
}

export default new DashboardController();
