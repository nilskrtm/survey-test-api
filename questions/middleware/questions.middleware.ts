import { Request, Response, NextFunction } from 'express';
import { Survey } from '../../surveys/daos/surveys.dao';
import { Question } from '../daos/questions.dao';

//const log: debug.IDebugger = debug('app:questions-controllers');

class QuestionsMiddleware {
  isValidQuestionOrdering(req: Request, res: Response, next: NextFunction) {
    const survey: Survey = res.locals.survey;
    const newSorting = req.body.ordering;

    if (survey.questions.length == Object.keys(newSorting).length) {
      const questionIds = survey.questions.map(
        questionObject => questionObject._id,
      );

      if (
        questionIds.every(
          questionId =>
            questionId in newSorting &&
            typeof newSorting[questionId] === 'number',
        )
      ) {
        const toFill: { [order: number]: null | string } = {};

        for (let order = 1; order <= survey.questions.length; order++) {
          toFill[order] = null;
        }

        Object.keys(newSorting).forEach(questionId => {
          toFill[newSorting[questionId]] = questionId;
        });

        let valid = true;

        for (let orderAsString of Object.keys(toFill)) {
          let order: number = parseInt(orderAsString);

          if (toFill[order] === null) {
            valid = false;

            break;
          }
        }

        if (valid) {
          return next();
        }
      }
    }

    res.status(400).send();
  }

  validateQuestionExists(req: Request, res: Response, next: NextFunction) {
    const survey: Survey = res.locals.survey;
    const questions: Question[] = survey.questions.filter(
      questionObject => questionObject._id === req.body.locals.questionId,
    );

    if (questions.length > 0) {
      res.locals.question = questions[0];

      next();
    } else {
      res.status(404).send({
        error: `Question ${req.params.questionId} not found`,
      });
    }
  }

  extractQuestionId(req: Request, res: Response, next: NextFunction) {
    req.body.locals.questionId = req.params.questionId;

    next();
  }
}

export default new QuestionsMiddleware();
