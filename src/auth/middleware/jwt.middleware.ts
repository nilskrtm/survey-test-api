import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt.type';
import UsersService from '../../users/services/users.service';

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'accessToken';
const refreshTokenSecret: string =
  process.env.REFRESH_TOKEN_SECRET || 'refreshToken';

class JwtMiddleware {
  verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res
        .status(400)
        .send({ errors: ['Missing required field: refreshToken'] });
    }
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = jwt.verify(
        req.body.refreshToken,
        refreshTokenSecret,
      ) as Jwt;

      const user: any = await UsersService.getById(refreshToken.userId);

      req.body = {
        userId: user._id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        permissionLevel: user.permissionLevel,
      };

      return next();
    } catch (err) {
      return res.status(400).send({ errors: ['Invalid refresh token'] });
    }
  }

  /* replaced by validAuthorizationNeeded() in AuthMiddleware */
  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');

        if (authorization[0] !== 'Bearer') {
          return res.status(401).send();
        } else {
          res.locals.jwt = jwt.verify(
            authorization[1],
            accessTokenSecret,
          ) as Jwt;

          next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
