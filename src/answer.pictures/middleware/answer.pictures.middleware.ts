import { Request, Response, NextFunction } from 'express';
import { AnswerPicture } from '../daos/answer.pictures.dao';
import AnswerPicturesService from '../../answer.pictures/services/answer.pictures.service';
import SurveysDAO from '../../surveys/daos/surveys.dao';

//const log: debug.IDebugger = debug('app:answer-pictures-controllers');

class AnswerPicturesMiddleware {
  async validateAnswerPictureNotUsed(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const answerPicture: AnswerPicture = res.locals.answerPicture;
    const result = await SurveysDAO.getModel()
      .aggregate([
        {
          $match: {
            draft: false,
          },
        },
        {
          $lookup: {
            from: 'questions',
            localField: 'questions',
            foreignField: '_id',
            as: 'questionObjects',
          },
        },
        {
          $unwind: {
            path: '$questionObjects',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'answer_options',
            localField: 'questionObjects.answerOptions',
            foreignField: '_id',
            as: 'answerOptions',
          },
        },
        {
          $unwind: {
            path: '$answerOptions.picture',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'answerOptions.picture': answerPicture._id,
            draft: false,
          },
        },
        {
          $count: 'count',
        },
      ])
      .exec();

    if (
      result.length === 0 ||
      ('count' in result[0] && result[0].count === 0)
    ) {
      next();
    } else {
      res.status(404).send({
        error: `AnswerPicture ${req.params.answerPictureId} in use can not be edited`,
      });
    }
  }

  validateFormDataPictureValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const picture: Express.Multer.File | undefined = req.file;

    if (picture !== undefined) {
      const allowedMimeTypes = (process.env.ALLOWED_MIME_TYPES || '').split(
        ';',
      );

      if (allowedMimeTypes.includes(picture.mimetype)) {
        next();
      } else {
        res.status(400).send({
          error: `Picture has invalid mime-type`,
        });
      }
    } else {
      next();
    }
  }

  async validateAnswerPictureExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const answerPicture: AnswerPicture = await AnswerPicturesService.getById(
      req.body.locals.answerPictureId,
    );

    if (answerPicture) {
      res.locals.answerPicture = answerPicture;

      next();
    } else {
      res.status(404).send({
        error: `AnswerPicture ${req.params.answerPictureId} not found`,
      });
    }
  }

  extractAnswerPictureId(req: Request, res: Response, next: NextFunction) {
    req.body.locals.answerPictureId = req.params.answerPictureId;

    next();
  }
}

export default new AnswerPicturesMiddleware();
