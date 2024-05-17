import { Request, Response, NextFunction } from 'express';
import AnswerPicturesDAO, { AnswerPicture } from '../daos/answer.pictures.dao';
import AnswerPicturesService from '../../answer.pictures/services/answer.pictures.service';
import SurveysDAO from '../../surveys/daos/surveys.dao';
import { Meta } from 'express-validator';

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
        /*
        {
          $match: {
            draft: false,
          },
        },
         */
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
            // draft: false,
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

  // needed to get userId in custom validator for name of survey
  prepareValidateAnswerPictureNameNotExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    req.body._local_owner = res.locals.jwt.userId;

    next();
  }

  async validateAnswerPictureNameNotExists(value: string, meta: Meta) {
    const surveys = await AnswerPicturesDAO.getModel().aggregate([
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
      throw new Error('Es existiert bereits ein Bild mit diesem Namen.');
    }
  }

  async validateAnswerPictureExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const answerPicture: AnswerPicture | null =
      await AnswerPicturesService.getById(req.body.locals.answerPictureId);

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
