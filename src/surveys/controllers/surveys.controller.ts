import debug from 'debug';
import { Request, Response } from 'express';
import SurveysService from '../../surveys/services/surveys.service';

const log: debug.IDebugger = debug('app:surveys-controller');

class SurveysController {
  async listSurveys(req: Request, res: Response) {
    const surveys = await SurveysService.list(
      req.body,
      res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    );

    res.status(200).send(surveys);
  }

  async getSurveyById(req: Request, res: Response) {
    const survey = await SurveysService.getById(req.body.locals.surveyId);

    res.status(200).send({ survey: survey });
  }

  async createSurvey(req: Request, res: Response) {
    const surveyId = await SurveysService.create({
      ...req.body,
      owner: res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    });

    log(`created new survey ${surveyId}`);

    res.status(201).send({ id: surveyId });
  }

  async patch(req: Request, res: Response) {
    await SurveysService.patchById(req.body.locals.surveyId, req.body);

    log(`updated survey ${req.body.locals.surveyId}`);

    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    await SurveysService.putById(req.body.locals.surveyId, req.body);

    log(`updated survey ${req.body.locals.surveyId}`);

    res.status(204).send();
  }

  async removeSurvey(req: Request, res: Response) {
    await SurveysService.deleteById(req.body.locals.surveyId);

    log(`deleted survey ${req.body.locals.surveyId}`);

    res.status(204).send();
  }
}

export default new SurveysController();
