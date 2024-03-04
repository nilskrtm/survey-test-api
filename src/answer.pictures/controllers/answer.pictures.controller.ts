import debug from 'debug';
import { Request, Response } from 'express';
import AnswerPicturesService from '../services/answer.pictures.service';
import S3Service from '../../common/services/s3.service';
import * as mime from 'mime-types';
import { AnswerPicture } from '../daos/answer.pictures.dao';

const log: debug.IDebugger = debug('app:answer-pictures-controller');

class AnswerPicturesController {
  async listAnswerPictures(req: Request, res: Response) {
    const answerPictures = await AnswerPicturesService.list(
      req.body,
      res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    );

    res.status(200).send(answerPictures);
  }

  async getAnswerPictureById(req: Request, res: Response) {
    const answerPicture = await AnswerPicturesService.getById(
      req.body.locals.answerPictureId,
    );

    // CAUTION: normally this method is only called after AnswerPicturesMiddleware.validateAnswerPictureExists(...) was called,
    // by this 'answerPicture' should always be non-null
    // nevertheless, the opposite case has to be intercepted here later
    if (answerPicture) {
      const answerPictureWithUrl = Object.assign(
        {},
        answerPicture as AnswerPicture,
        {
          url: S3Service.getPictureURL(answerPicture.fileName),
        },
      );

      res.status(200).send({ answerPicture: answerPictureWithUrl });
    }
  }

  async createAnswerPicture(req: Request, res: Response) {
    const answerPictureId = await AnswerPicturesService.create({
      ...req.body,
      owner: res.locals.jwt?.userId || res.locals.basicAuth?.userId,
    });

    if (req.file !== undefined) {
      const fileName =
        answerPictureId + '.' + mime.extension(req.file.mimetype);

      try {
        await S3Service.uploadPicture(
          fileName,
          req.file.buffer,
          req.file.mimetype,
        );
      } catch (err) {
        return res.status(500);
      }

      await AnswerPicturesService.patchById(answerPictureId, {
        fileName: fileName,
      });
    }

    log(`created new answer-picture ${answerPictureId}`);

    res.status(201).send({ id: answerPictureId });
  }

  async patch(req: Request, res: Response) {
    await AnswerPicturesService.patchById(req.body.locals.answerPictureId, {
      ...req.body,
      edited: new Date(),
    });

    if (req.file !== undefined) {
      const fileName =
        req.body.locals.answerPictureId +
        '.' +
        mime.extension(req.file.mimetype);

      try {
        await S3Service.uploadPicture(
          fileName,
          req.file.buffer,
          req.file.mimetype,
        );
      } catch (err) {
        return res.status(500);
      }

      await AnswerPicturesService.patchById(req.body.locals.answerPictureId, {
        fileName: fileName,
      });
    }

    log(`updated answer-picture ${req.body.locals.answerPictureId}`);

    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    await AnswerPicturesService.putById(req.body.locals.answerPictureId, {
      ...req.body,
      edited: new Date(),
    });

    if (req.file !== undefined) {
      const fileName =
        req.body.locals.answerPictureId +
        '.' +
        mime.extension(req.file.mimetype);

      try {
        await S3Service.uploadPicture(
          fileName,
          req.file.buffer,
          req.file.mimetype,
        );
      } catch (err) {
        return res.status(500);
      }

      await AnswerPicturesService.patchById(req.body.locals.answerPictureId, {
        fileName: fileName,
      });
    }

    log(`updated answer-picture ${req.body.locals.answerPictureId}`);

    res.status(204).send();
  }

  async removeAnswerPicture(req: Request, res: Response) {
    const answerPicture: AnswerPicture = res.locals.answerPicture;

    if (
      answerPicture.fileName &&
      (await S3Service.pictureExists(answerPicture.fileName))
    ) {
      await S3Service.deletePicture(answerPicture.fileName);
    }

    await AnswerPicturesService.deleteById(req.body.locals.answerPictureId);

    log(`deleted answer-picture ${req.body.locals.answerPictureId}`);

    res.status(204).send();
  }
}

export default new AnswerPicturesController();
