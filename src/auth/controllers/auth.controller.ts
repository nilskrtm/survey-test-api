import { Request, Response } from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import { Jwt } from '../../common/types/jwt.type';
import { User } from '../../users/daos/users.dao';
import UsersService from '../../users/services/users.service';
import EmailService from '../../common/services/email.service';
import { v4 as uuid } from 'uuid';
import PasswordRequestService from '../services/password.request.service';
import PasswordResetEmail from '../../emails/templates/PasswordResetEmail';
import argon2 from 'argon2';
import PasswordResetSuccessEmail from '../../emails/templates/PasswordResetSuccessEmail';

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

  async requestResetUserPassword(req: Request, res: Response) {
    const user = await UsersService.getUserByEmail(req.body.email);

    if (user) {
      let passwordRequestId: string | null = null;

      try {
        // invalidate existing password request of specific user (if exists)
        await PasswordRequestService.deleteById(user._id);

        passwordRequestId = await PasswordRequestService.create({
          user: user._id,
        });
      } catch (err) {
        log(err);
      }

      if (passwordRequestId) {
        const passwordResetLink = (
          process.env.EMAIL_PASSWORD_RESET_LINK || ''
        ).replace('$passwordRequestId', passwordRequestId);
        const emailTemplate = PasswordResetEmail({
          passwordResetLink: passwordResetLink,
        });

        await EmailService.sendMail(uuid(), {
          to: user.email,
          html: emailTemplate.html,
          subject: emailTemplate.subject,
        });
      }
    }

    // send OK even if no user with give email exists, prevent finding email to an existing account
    return res.status(200).send();
  }

  async validateRequestResetUserPassword(req: Request, res: Response) {
    const { passwordRequestId } = req.body;
    const passwordRequest =
      await PasswordRequestService.getById(passwordRequestId);

    console.log(passwordRequestId);
    console.log(passwordRequest);

    if (passwordRequest) {
      const user = await UsersService.getById(passwordRequest.user._id);

      if (user) {
        return res.status(200).send({ user: user });
      }
    }

    return res.status(400).send({
      errors: ['Der Link zum Zurücksetzen des Passwortes ist ungültig.'],
    });
  }

  async resetUserPassword(req: Request, res: Response) {
    const { passwordRequestId, password } = req.body;

    if (passwordRequestId && password) {
      const passwordRequest =
        await PasswordRequestService.getById(passwordRequestId);

      if (passwordRequest) {
        const user = await UsersService.getUserByIdWithPassword(
          passwordRequest.user._id,
        );

        if (user) {
          const oldPassword = user.password;
          const newPassword = password;
          let updatedPassword: boolean = false;
          let sentMail: boolean = false;

          try {
            await UsersService.patchById(user._id, {
              password: await argon2.hash(newPassword),
            });
            // invalidate password request
            await PasswordRequestService.deleteById(user._id);

            updatedPassword = true;
          } catch (err) {
            log(err);
          }

          if (updatedPassword) {
            try {
              const emailTemplate = PasswordResetSuccessEmail();

              await EmailService.sendMail(uuid(), {
                to: user.email,
                html: emailTemplate.html,
                subject: emailTemplate.subject,
              });

              sentMail = true;
            } catch (err) {
              log(err);
            }

            if (!sentMail) {
              await UsersService.patchById(user._id, {
                password: oldPassword,
              });

              return res.status(500).send({
                errors: [
                  'Bei dem Ändern des Passwortes ist ein Fehler aufgetreten.',
                ],
              });
            }

            return res.status(200).send();
          }

          return res.status(400).send({
            errors: [
              'Bei dem Ändern des Passwortes ist ein Fehler aufgetreten.',
            ],
          });
        }
      }
    }

    return res.status(400).send({
      errors: ['Der Link zum Zurücksetzen des Passwortes ist ungültig.'],
    });
  }
}

export default new AuthController();
