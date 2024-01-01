import debug from 'debug';
import { Request, Response } from 'express';
import QuestionsService from '../../questions/services/questions.service';
import SurveysService from '../../surveys/services/surveys.service';
import { Question } from '../../questions/daos/questions.dao';
import AnswerOptionsService from '../services/answer.options.service';

const log: debug.IDebugger = debug('app:answer-options-controller');

class AnswerOptionsController {
  async listAnswerOptions(req: Request, res: Response) {
    const answerOptions = await AnswerOptionsService.list(
      req.body.paging,
      req.body.locals.questionId,
    );

    res.status(200).send(answerOptions);
  }

  async getAnswerOptionById(req: Request, res: Response) {
    const answerOption = await AnswerOptionsService.getById(
      req.body.locals.answerOptionId,
    );

    res.status(200).send({ answerOption: answerOption });
  }

  async createAnswerOption(req: Request, res: Response) {
    const question: Question = res.locals.question;
    const answerOptionId = await AnswerOptionsService.create({
      ...req.body,
      order: question.answerOptions.length + 1,
    });
    const answerOptionIds: string[] = question.answerOptions.map(
      answerOptionObject => answerOptionObject._id,
    );

    if (!answerOptionIds.includes(answerOptionId)) {
      answerOptionIds.push(answerOptionId);
    }

    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });
    const patchQuestion = QuestionsService.patchById(question._id, {
      answerOptions: answerOptionIds,
    });

    await Promise.all([patchQuestion, patchSurvey]);

    log(
      `created new answer-option ${answerOptionId} for question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(201).send({ id: answerOptionId });
  }

  async patch(req: Request, res: Response) {
    const patchAnswerOption = AnswerOptionsService.patchById(
      req.body.locals.answerOptionId,
      req.body,
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });

    await Promise.all([patchAnswerOption, patchSurvey]);

    log(
      `updated answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    const patchAnswerOption = AnswerOptionsService.putById(
      req.body.locals.answerOptionId,
      req.body,
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });

    await Promise.all([patchAnswerOption, patchSurvey]);

    log(
      `updated answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async removeAnswerOption(req: Request, res: Response) {
    const question: Question = res.locals.question;
    const answerOptionIds = question.answerOptions
      .map(answerOptionObject => {
        if (answerOptionObject._id !== req.body.locals.answerOptionId) {
          return answerOptionObject._id;
        }
      })
      .filter(answerOptionId => answerOptionId);
    const newSorting: { [index: string]: number } = {};

    answerOptionIds.map((answerOptionId, index) => {
      newSorting[answerOptionId] = index + 1;
    });

    const deleteAnswerOption = AnswerOptionsService.deleteById(
      req.body.locals.answerOptionId,
    );
    const patchQuestion = QuestionsService.patchById(
      req.body.locals.questionId,
      {
        answerOptions: answerOptionIds,
      },
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });
    const patchAnswerOptions: Promise<any>[] = [];

    Object.keys(newSorting).forEach(answerOptionId => {
      patchAnswerOptions.push(
        AnswerOptionsService.patchById(answerOptionId, {
          order: newSorting[answerOptionId],
        }),
      );
    });

    await Promise.all([
      ...[deleteAnswerOption, patchQuestion, patchSurvey],
      ...patchAnswerOptions,
    ]);

    log(
      `deleted answer-option ${req.body.locals.answerOptionId} of question ${req.body.locals.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }

  async reorderAnswerOptions(req: Request, res: Response) {
    const question: Question = res.locals.question;
    const newSorting = req.body.ordering;
    const patchAnswerOptions: Promise<any>[] = [];
    const answerOptionIds: string[] = Array(question.answerOptions.length).fill(
      '',
    );

    Object.keys(newSorting).forEach(answerOptionId => {
      answerOptionIds[newSorting[answerOptionId] - 1] = answerOptionId;
      patchAnswerOptions.push(
        AnswerOptionsService.patchById(answerOptionId, {
          order: newSorting[answerOptionId],
        }),
      );
    });

    const patchQuestion = QuestionsService.patchById(
      req.body.locals.questionId,
      {
        answerOptions: answerOptionIds,
      },
    );
    const patchSurvey = SurveysService.patchById(req.body.locals.surveyId, {
      edited: new Date(),
    });

    await Promise.all([...[patchQuestion, patchSurvey], ...patchAnswerOptions]);

    log(
      `reordered answer-options of question ${req.body.local.questionId} of survey ${req.body.locals.surveyId}`,
    );

    res.status(204).send();
  }
}

export default new AnswerOptionsController();
