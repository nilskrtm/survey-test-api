import debug from 'debug';
import { Request, Response } from 'express';
import { PopulatedSurvey } from '../../surveys/daos/surveys.dao';
import VotingsService from '../services/votings.service';

const log: debug.IDebugger = debug('app:votings-controller');

class VotingsController {
  async createVoting(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const votingId = await VotingsService.create({
      ...req.body,
      survey: survey._id,
    });

    log(
      `created new voting ${votingId} for survey ${req.body.locals.surveyId}`,
    );

    res.status(201).send({ id: votingId });
  }

  async getVotingCount(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const votingCount = await VotingsService.getVotingCount(survey._id);

    res.status(200).send({ count: votingCount });
  }
}

export default new VotingsController();
