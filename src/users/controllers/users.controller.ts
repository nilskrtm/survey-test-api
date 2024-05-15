import { Request, Response } from 'express';
import argon2 from 'argon2';
import debug from 'debug';
import UsersService from '../services/users.service';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
  async listUsers(req: Request, res: Response) {
    const data = await UsersService.list(req.body);

    res.status(200).send(data);
  }

  async getUserById(req: Request, res: Response) {
    const user = await UsersService.getById(req.body.locals.userId);

    res.status(200).send({ user: user });
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await argon2.hash(req.body.password);

    const userId = await UsersService.create(req.body);

    res.status(201).send({ id: userId });
  }

  async patch(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }

    await UsersService.patchById(req.body.locals.userId, req.body);

    log(`updated user ${req.body.locals.userId}`);

    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    req.body.password = await argon2.hash(req.body.password);

    await UsersService.putById(req.body.locals.userId, req.body);

    log(`updated user ${req.body.locals.userId}`);

    res.status(204).send();
  }

  async removeUser(req: Request, res: Response) {
    await UsersService.deleteById(req.body.locals.userId);

    log(`deleted user ${req.body.locals.userId}`);

    res.status(204).send();
  }
}

export default new UsersController();
