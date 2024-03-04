import { Request, Response, NextFunction } from 'express';
import SurveyService from '../services/surveys.service';
import { PopulatedSurvey } from '../daos/surveys.dao';
import { AnswerPicture } from '../../answer.pictures/daos/answer.pictures.dao';

//const log: debug.IDebugger = debug('app:surveys-controllers');

class SurveyMiddleware {
  validateSetStartEndDates(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey = res.locals.survey;
    const surveyStartDate = new Date(survey.startDate).getTime();
    const surveyEndDate = new Date(survey.endDate).getTime();
    const currentDate = new Date().getTime();
    let startDateToSet = req.body.startDate;
    let endDateToSet = req.body.endDate;

    if (startDateToSet && !endDateToSet) {
      startDateToSet = new Date(startDateToSet).getTime();

      if (startDateToSet >= surveyEndDate) {
        return res.status(400).send({
          error: `Das Startdatum muss vor dem Enddatum der Umfrage liegen.`,
        });
      }
    } else if (!startDateToSet && endDateToSet) {
      endDateToSet = new Date(endDateToSet).getTime();

      if (endDateToSet <= surveyStartDate) {
        return res.status(400).send({
          error: `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
        });
      }

      if (endDateToSet <= currentDate) {
        return res.status(400).send({
          error: `Das Enddatum der Umfrage muss in der Zukunft liegen.`,
        });
      }
    } else if (startDateToSet && endDateToSet) {
      startDateToSet = new Date(startDateToSet).getTime();
      endDateToSet = new Date(endDateToSet).getTime();

      if (endDateToSet <= currentDate) {
        return res.status(400).send({
          error: `Das Enddatum der Umfrage muss in der Zukunft liegen.`,
        });
      }

      if (endDateToSet <= startDateToSet) {
        return res.status(400).send({
          error: `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
        });
      }
    }

    next();
  }

  validateSurveyIsNoDraft(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey = res.locals.survey;

    if (!survey.draft) {
      next();
    } else {
      res.status(400).send({
        error: `Survey ${survey._id} is still a draft`,
      });
    }
  }

  validateSurveyIsDraft(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey = res.locals.survey;

    if (survey.draft) {
      next();
    } else {
      res.status(400).send({
        error: `Survey ${survey._id} is not a draft`,
      });
    }
  }

  validateSurveyModifiable(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey = res.locals.survey;

    if (!survey.draft) {
      if (
        !('name' in req.body) &&
        !('description' in req.body) &&
        !('greeting' in req.body)
      ) {
        return next();
      } else {
        res.status(400).send({
          error: `Survey ${survey._id} is not a draft`,
        });
      }
    } else {
      next();
    }
  }

  validateSurveyFinalizable(req: Request, res: Response, next: NextFunction) {
    if ('draft' in req.body && req.body.draft === false) {
      const survey: PopulatedSurvey = res.locals.survey;
      const surveyStartDate = new Date(survey.startDate).getTime();
      const surveyEndDate = new Date(survey.endDate).getTime();
      const currentDate = new Date().getTime();

      if (
        surveyStartDate < surveyEndDate &&
        surveyEndDate > currentDate &&
        survey.questions.length > 0
      ) {
        const allQuestionsValid = survey.questions.every(questionObject => {
          return (
            questionObject.question.length > 0 &&
            questionObject.timeout >= 0 &&
            questionObject.order > 0 &&
            questionObject.answerOptions.length > 0
          );
        });
        const questionsOrderValid =
          survey.questions.reduce(
            (accumulator: number, questionObject) =>
              accumulator + questionObject.order,
            0,
          ) ==
          Array.from(Array(survey.questions.length + 1).keys()).reduce(
            (accumulator, value) => accumulator + value,
            0,
          );

        if (allQuestionsValid && questionsOrderValid) {
          let allQuestionsAnswerOptionsValid = true;
          let answerOptionsOrderValid = true;

          for (let questionObject of survey.questions) {
            if (
              !questionObject.answerOptions.every(answerOptionObject => {
                return (
                  answerOptionObject.picture &&
                  answerOptionObject.color &&
                  answerOptionObject.order > 0
                );
              })
            ) {
              allQuestionsAnswerOptionsValid = false;

              break;
            }

            if (
              questionObject.answerOptions.reduce(
                (accumulator: number, answerOptionObject) =>
                  accumulator + answerOptionObject.order,
                0,
              ) !==
              Array.from(
                Array(questionObject.answerOptions.length + 1).keys(),
              ).reduce((accumulator, value) => accumulator + value, 0)
            ) {
              answerOptionsOrderValid = false;

              break;
            }
          }

          if (allQuestionsAnswerOptionsValid && answerOptionsOrderValid) {
            const answerPictureObjects: AnswerPicture[] = [];

            for (let questionObject of survey.questions) {
              for (let answerOptionObject of questionObject.answerOptions) {
                answerPictureObjects.push(answerOptionObject.picture);
              }
            }

            const allAnswerPicturesValid = answerPictureObjects.every(
              answerPictureObject => {
                return answerPictureObject.name && answerPictureObject.fileName;
              },
            );

            if (allAnswerPicturesValid) {
              return next();
            }
          }
        }
      }

      res.status(400).send({
        error: `Survey ${survey._id} is not finalizable`,
      });
    } else {
      next();
    }
  }

  async validateSurveyExists(req: Request, res: Response, next: NextFunction) {
    const survey: PopulatedSurvey | null = await SurveyService.getById(
      req.body.locals.surveyId,
    );

    if (survey) {
      res.locals.survey = survey;

      next();
    } else {
      res.status(404).send({
        error: `Survey ${req.params.surveyId} not found`,
      });
    }
  }

  extractSurveyId(req: Request, res: Response, next: NextFunction) {
    req.body.locals.surveyId = req.params.surveyId;

    next();
  }
}

export default new SurveyMiddleware();
