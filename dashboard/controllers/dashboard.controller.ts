import { Request, Response } from 'express';
import SurveysDao from '../../surveys/daos/surveys.dao';

// const log: debug.IDebugger = debug('app:dashboard-controller');

class DashboardController {
  async getDashboardMetrics(req: Request, res: Response) {
    const surveyCount = await SurveysDao.getSurveyCountOfOwner(
      res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    );

    res.status(200).send({
      metrics: { surveyCount: surveyCount, votingCount: 0, pictureCount: 0 },
    });
  }
}

export default new DashboardController();
