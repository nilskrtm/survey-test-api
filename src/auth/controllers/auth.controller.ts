import { Request, Response } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt.type';
import { User } from '../../users/daos/users.dao';

const log: debug.IDebugger = debug('app:auth-controller');

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'accessToken';
const accessTokenExpirationInSeconds = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION || '3600',
);
const refreshTokenSecret: string =
  process.env.REFRESH_TOKEN_SECRET || 'refreshToken';
const refreshTokenExpirationInSeconds = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION || '86400',
);

class AuthController {
  createJWT(req: Request, res: Response) {
    const payload: Jwt = {
      userId: req.body.userId,
      permissionLevel: req.body.permissionLevel,
    };
    const userData: Partial<User> = {
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    try {
      const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenExpirationInSeconds,
      });
      const refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: refreshTokenExpirationInSeconds,
      });

      return res.status(201).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userData,
      });
    } catch (err) {
      log('createJWT error: %O', err);

      return res.status(500).send();
    }
  }

  refreshJWT(req: Request, res: Response) {
    const payload: Jwt = {
      userId: req.body.userId,
      permissionLevel: req.body.permissionLevel,
    };
    const userData: Partial<User> = {
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };

    try {
      const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenExpirationInSeconds,
      });

      return res.status(201).send({ accessToken: accessToken, user: userData });
    } catch (err) {
      log('createJWT error: %O', err);

      return res.status(500).send();
    }
  }
}

export default new AuthController();
