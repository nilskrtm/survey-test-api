import {Request, Response, NextFunction} from 'express';
import UsersService from '../../users/services/users.service';
import * as argon2 from 'argon2';
import {User} from '../../users/daos/users.dao';
import jwt from 'jsonwebtoken';
import {Jwt} from '../../common/types/jwt.type';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

class AuthMiddleware {
  async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
    const user: any = await UsersService.getUserByUsernameWithPassword(
      req.body.username,
    );

    if (user) {
      const passwordHash = user.password;

      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          permissionLevel: user.permissionLevel,
        };

        return next();
      }
    }

    res.status(400).send({errors: ['Invalid username/email and/or password']});
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
            const user: User =
              await UsersService.getUserByUsernameWithAccessKey(username);

            if (
              user &&
              (user.accessKey as string).localeCompare(accessKey) === 0
            ) {
              res.locals.basicAuth = {
                userId: user._id,
                username: user.username,
              };

              return next();
            }

            return res.status(401).send();
          }

          if (authorization[0] === 'Bearer') {
            res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;

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
}

export default new AuthMiddleware();
