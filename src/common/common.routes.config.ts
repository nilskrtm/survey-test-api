import { Application } from 'express';

export abstract class CommonRoutesConfig {
  app: Application;
  name: string;

  protected constructor(app: Application, name: string) {
    this.app = app;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  abstract configureRoutes(): Application;
}
