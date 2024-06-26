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

  async getVotingsAbsoluteOfSurvey(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const votingsResponse = await VotingsService.getVotingsAbsoluteOfSurvey(
      survey._id,
    );

    res.status(200).send(votingsResponse);
  }

  async getVotingsDaySpanOfSurvey(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const timezone: string = req.query.timezone
      ? (req.query.timezone as string)
      : 'UTC';
    const startDate: string = req.query.startDate as string;
    const endDate: string = req.query.endDate as string;
    const timezoneStartDate = new Date(
      new Date(startDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    );
    const timezoneEndDate = new Date(
      new Date(endDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    );

    timezoneStartDate.setHours(0, 0, 0, 0);
    timezoneEndDate.setHours(23, 59, 59, 999);

    const votingsResponse = await VotingsService.getVotingsDaySpanOfSurvey(
      survey._id,
      timezone,
      timezoneStartDate.toISOString(),
      timezoneEndDate.toISOString(),
    );

    res.status(200).send(votingsResponse);
  }

  async getVotingsHourSpanOfSurvey(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const timezone: string = req.query.timezone
      ? (req.query.timezone as string)
      : 'UTC';
    const dayDate: string = req.query.dayDate as string;
    const startDate: string = req.query.startDate as string;
    const endDate: string = req.query.endDate as string;
    let timezoneDayDate = new Date(
      new Date(dayDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    );

    timezoneDayDate.setHours(0, 0, 0, 0);

    let timezoneStartDate = new Date(
      new Date(startDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    );
    let timezoneEndDate = new Date(
      new Date(endDate).toLocaleString('en-US', {
        timeZone: timezone,
      }),
    );

    timezoneStartDate.setFullYear(
      timezoneDayDate.getFullYear(),
      timezoneDayDate.getMonth(),
      timezoneDayDate.getDate(),
    );
    timezoneEndDate.setFullYear(
      timezoneDayDate.getFullYear(),
      timezoneDayDate.getMonth(),
      timezoneDayDate.getDate(),
    );

    const votingsResponse = await VotingsService.getVotingsHourSpanOfSurvey(
      survey._id,
      timezone,
      timezoneDayDate.toISOString(),
      timezoneStartDate.toISOString(),
      timezoneEndDate.toISOString(),
    );

    res.status(200).send(votingsResponse);
  }

  async getVotingCountOfUser(req: Request, res: Response) {
    const votingCount = await VotingsService.getVotingCountOfUser(
      res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    );

    res.status(200).send({ count: votingCount });
  }

  async getVotingCountOfSurvey(req: Request, res: Response) {
    const survey: PopulatedSurvey = res.locals.survey;
    const votingCount = await VotingsService.getVotingCountOfSurvey(survey._id);

    res.status(200).send({ count: votingCount });
  }
}

export default new VotingsController();
