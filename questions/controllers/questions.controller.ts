import debug from 'debug';
import {Request, Response} from 'express';
import QuestionsService from '../../questions/services/questions.service';
import SurveysService from '../../surveys/services/surveys.service';
import {Survey} from '../../surveys/daos/surveys.dao';

const log: debug.IDebugger = debug('app:questions-controller');

class QuestionsController {
  async listQuestions(req: Request, res: Response) {
    const questions = await QuestionsService.list(
      req.body.paging,
      req.body.locals.surveyId,
    );

    res.status(200).send(questions);
  }

  async getQuestionById(req: Request, res: Response) {
    const question = await QuestionsService.getById(req.body.locals.questionId);

    res.status(200).send({question: question});
  }

  async createQuestion(req: Request, res: Response) {
    const survey: Survey = res.locals.survey;
    const questionId = await QuestionsService.create({
      ...req.body,
      order: survey.questions.length + 1,
    });
    const questionIds: string[] = survey.questions.map(
      questionObject => questionObject._id,
    );

    if (!questionIds.includes(questionId)) {
      questionIds.push(questionId);
    }

    await SurveysService.patchById(survey._id, {
      questions: questionIds,
      edited: new Date(),
    });

    log(
      `created new question ${questionId} for survey ${req.body.locals.surveyId}`,
    );

    res.status(201).send({id: questionId});
  }

  async patch(req: Request, res: Response) {
    const patchQuestion = QuestionsService.patchById(
      req.body.locals.questionId,
      req.body,
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });

    await Promise.all([patchQuestion, patchSurvey]);

    log(
      `updated question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    const patchQuestion = QuestionsService.putById(
      req.body.locals.questionId,
      req.body,
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });

    await Promise.all([patchQuestion, patchSurvey]);

    log(
      `updated question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async removeQuestion(req: Request, res: Response) {
    const survey: Survey = res.locals.survey;
    const questionIds = survey.questions
      .map(questionObject => {
        if (questionObject._id !== req.body.locals.questionId) {
          return questionObject._id;
        }
      })
      .filter(questionId => questionId);
    const newSorting: {[index: string]: number} = {};

    questionIds.map((questionId, index) => {
      newSorting[questionId] = index + 1;
    });

    const deleteQuestion = QuestionsService.deleteById(
      req.body.locals.questionId,
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
      questions: questionIds,
    });
    const patchQuestions: Promise<any>[] = [];

    Object.keys(newSorting).forEach(questionId => {
      patchQuestions.push(
        QuestionsService.patchById(questionId, {order: newSorting[questionId]}),
      );
    });

    await Promise.all([...[deleteQuestion, patchSurvey], ...patchQuestions]);

    log(
      `deleted question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async reorderQuestions(req: Request, res: Response) {
    const survey: Survey = res.locals.survey;
    const newSorting = req.body.ordering;
    const patchQuestions: Promise<any>[] = [];
    const questionIds: string[] = Array(survey.questions.length).fill('');

    console.log(survey.questions.length);
    console.log(questionIds.length);

    Object.keys(newSorting).forEach(questionId => {
      questionIds[newSorting[questionId] - 1] = questionId;
      patchQuestions.push(
        QuestionsService.patchById(questionId, {order: newSorting[questionId]}),
      );
    });

    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
      questions: questionIds,
    });

    await Promise.all([...[patchSurvey], ...patchQuestions]);

    log(`reordered questions of survey ${req.body.locals.surveyId}`);

    res.status(204).send();
  }
}

export default new QuestionsController();
