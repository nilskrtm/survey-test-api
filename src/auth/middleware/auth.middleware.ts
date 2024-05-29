import { Request, Response, NextFunction } from 'express';
import UsersService from '../../users/services/users.service';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt.type';
import { User } from '../../users/daos/users.dao';
import PasswordRequestService from '../services/password.request.service';

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'accessToken';

class AuthMiddleware {
  async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
    let user = await UsersService.getUserByUsernameWithPassword(
      req.body.username,
    );

    if (!user) {
      user = await UsersService.getUserByEmailWithPassword(req.body.username);
    }

    if (user) {
      const passwordHash = user.password;

      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          permissionLevel: user.permissionLevel,
        };

        return next();
      }
    }

    res.status(400).send({ errors: ['Die Anmeldedaten sind falsch.'] });
  }

  validAuthorizationNeeded(jwtAllowed: boolean, accessKeyAllowed: boolean) {
    return async function (req: Request, res: Response, next: NextFunction) {
      if (req.headers['authorization']) {
        try {
          const authorization = req.headers['authorization'].split(' ');

          if (authorization[0] === 'Basic' && accessKeyAllowed) {
            const b64Auth = authorization[1] || '';
            const [username, accessKey] = Buffer.from(b64Auth, 'base64')
              .toString()
              .split(':');
            const user: User | null =
              await UsersService.getUserByUsernameWithAccessKey(username);

            if (user && user.accessKey.localeCompare(accessKey) === 0) {
              res.locals.basicAuth = {
                userId: user._id,
                permissionLevel: user.permissionLevel,
              };

              return next();
            }

            return res.status(401).send();
          }

          if (authorization[0] === 'Bearer' && jwtAllowed) {
            res.locals.jwt = jwt.verify(
              authorization[1],
              accessTokenSecret,
            ) as Jwt;

            return next();
          }

          return res.status(401).send();
        } catch (err) {
          return res.status(403).send();
        }
      } else {
        return res.status(401).send();
      }
    };
  }

  async verifyPasswordRequestValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { passwordRequestId } = req.body;
    const passwordRequest = await PasswordRequestService.getById(
      passwordRequestId,
    );

    if (passwordRequest) {
      const user = await UsersService.getById(passwordRequest.user._id);

      if (user) {
        return next();
      }
    }

    return res.status(400).send({
      errors: ['Der Link zum Zurücksetzen des Passwortes ist ungültig.'],
    });
  }
}

export default new AuthMiddleware();
