import { Request, Response, NextFunction } from 'express';
import { PopulatedQuestion } from '../../questions/daos/questions.dao';
import AnswerPicturesService from '../../answer.pictures/services/answer.pictures.service';

//const log: debug.IDebugger = debug('app:answer-options-controllers');

class AnswerOptionsMiddleware {
  isValidAnswerOptionOrdering(req: Request, res: Response, next: NextFunction) {
    const question: PopulatedQuestion = res.locals.question;
    const newSorting = req.body.ordering;

    if (question.answerOptions.length == Object.keys(newSorting).length) {
      const answerOptionsIds = question.answerOptions.map(
        answerOptionObject => answerOptionObject._id,
      );

      if (
        answerOptionsIds.every(
          answerOptionsId =>
            answerOptionsId in newSorting &&
            typeof newSorting[answerOptionsId] === 'number',
        )
      ) {
        const toFill: { [order: number]: null | string } = {};

        for (let order = 1; order <= question.answerOptions.length; order++) {
          toFill[order] = null;
        }

        Object.keys(newSorting).forEach(answerOptionsId => {
          toFill[newSorting[answerOptionsId]] = answerOptionsId;
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

  async answerPictureToSetExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const answerPictureId = req.body.picture;

    if (answerPictureId) {
      const answerPicture = await AnswerPicturesService.getById(
        answerPictureId,
      );

      if (answerPicture && answerPicture.name && answerPicture.fileName) {
        next();
      } else {
        res.status(400).send();
      }
    } else {
      next();
    }
  }

  async validateAnswerOptionExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const question: PopulatedQuestion = res.locals.question;
    const answerOptions = question.answerOptions.filter(
      answerOptionObject =>
        answerOptionObject._id === req.body.locals.answerOptionId,
    );

    if (answerOptions.length > 0) {
      res.locals.answerOption = answerOptions[0];

      next();
    } else {
      res.status(404).send({
        error: `AnswerOption ${req.params.answerOptionId} not found`,
      });
    }
  }

  extractAnswerOptionId(req: Request, res: Response, next: NextFunction) {
    req.body.locals.answerOptionId = req.params.answerOptionId;

    next();
  }
}

export default new AnswerOptionsMiddleware();
