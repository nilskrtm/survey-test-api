import { NextFunction, Request, Response } from 'express';
import { PopulatedSurvey } from '../../surveys/daos/surveys.dao';

//const log: debug.IDebugger = debug('app:votings-controllers');

class VotingsMiddleware {
  validVoteData(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey = res.locals.survey;
    const votes = req.body.votes;

    if (Array.isArray(votes) && survey.questions.length === votes.length) {
      const questionsWithAnswerOptions: { [questionId: string]: string[] } = {};

      for (let i = 0; i < survey.questions.length; i++) {
        const questionObject = survey.questions[i];

        questionsWithAnswerOptions[questionObject._id] =
          questionObject.answerOptions.reduce(
            (accumulator: string[], answerOptionObject) => {
              accumulator.push(answerOptionObject._id);

              return accumulator;
            },
            [],
          );
      }

      const valid = votes.every(
        (voteObject: any) =>
          voteObject.question in questionsWithAnswerOptions &&
          questionsWithAnswerOptions[voteObject.question].includes(
            voteObject.answerOption,
          ),
      );

      if (valid) {
        return next();
      }
    }

    res.status(400).send({
      error: `Die Votes passen nicht zu der Umfrage.`,
    });
  }
}

export default new VotingsMiddleware();
