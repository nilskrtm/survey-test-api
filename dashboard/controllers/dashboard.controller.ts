import { Request, Response } from 'express';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import AnswerPicturesDAO from '../../answer.pictures/daos/answer.pictures.dao';

// const log: debug.IDebugger = debug('app:dashboard-controller');

class DashboardController {
  async getDashboardMetrics(req: Request, res: Response) {
    const userId = res.locals.jwt?.userId || res.locals.basicAuth?.userId;
    const surveyCount = await SurveysDAO.getSurveyCountOfOwner(userId);
    const votingCount = 0;
    const pictureCount = await AnswerPicturesDAO.getAnswerPictureCountOfUser(
      userId,
    );

    res.status(200).send({
      metrics: {
        surveyCount: surveyCount,
        votingCount: votingCount,
        pictureCount: pictureCount,
      },
    });
  }
}

export default new DashboardController();
