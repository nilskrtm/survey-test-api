import { Request, Response, NextFunction } from 'express';
import SurveyService from '../services/surveys.service';
import { PopulatedSurvey } from '../daos/surveys.dao';
import { AnswerPicture } from '../../answer.pictures/daos/answer.pictures.dao';
import { Meta } from 'express-validator';
import SurveysDAO from '../../surveys/daos/surveys.dao';

// const log: debug.IDebugger = debug('app:surveys-controllers');

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
          errors: [`Das Startdatum muss vor dem Enddatum der Umfrage liegen.`],
        });
      }
    } else if (!startDateToSet && endDateToSet) {
      endDateToSet = new Date(endDateToSet).getTime();

      if (endDateToSet <= surveyStartDate) {
        return res.status(400).send({
          errors: [
            `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
          ],
        });
      }

      if (endDateToSet <= currentDate) {
        return res.status(400).send({
          errors: [`Das Enddatum der Umfrage muss in der Zukunft liegen.`],
        });
      }
    } else if (startDateToSet && endDateToSet) {
      startDateToSet = new Date(startDateToSet).getTime();
      endDateToSet = new Date(endDateToSet).getTime();

      if (endDateToSet <= currentDate) {
        return res.status(400).send({
          errors: [`Das Enddatum der Umfrage muss in der Zukunft liegen.`],
        });
      }

      if (endDateToSet <= startDateToSet) {
        return res.status(400).send({
          errors: [
            `Das Enddatum muss hinter dem Startdatum der Umfrage liegen.`,
          ],
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

  // needed to get userId in custom validator for name of survey
  prepareValidateSurveyNameNotExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    req.body._local_owner = res.locals.jwt.userId;

    next();
  }

  async validateSurveyNameNotExists(value: string, meta: Meta) {
    const surveys = await SurveysDAO.getModel().aggregate([
      {
        $match: {
          owner: meta.req.body._local_owner,
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $toLower: '$name',
              },
              value.toLowerCase(),
            ],
          },
        },
      },
    ]);

    if (surveys.length > 0) {
      throw new Error('Es existiert bereits eine Umfrage mit diesem Namen.');
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
