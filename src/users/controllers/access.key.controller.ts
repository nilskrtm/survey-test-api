import { Request, Response } from 'express';
import UsersService from '../services/users.service';
import { generateAccessKey } from '../../common/utils/access.key.util';
import debug from 'debug';

const log: debug.IDebugger = debug('app:access-key-controller');

class AccessKeyController {
  async getAccessKey(req: Request, res: Response) {
    const user = await UsersService.getByIdWithAccessKey(res.locals.jwt.userId);

    if (user) {
      res.status(200).send({ accessKey: user.accessKey });
    } else {
      res.status(404).send();
    }
  }

  async generateAccessKey(req: Request, res: Response) {
    const newAccessKey = generateAccessKey(10);

    log(
      await UsersService.patchById(res.locals.jwt.userId, {
        accessKey: newAccessKey,
      }),
    );

    res.status(200).send({
      accessKey: newAccessKey,
    });
  }
}

export default new AccessKeyController();
