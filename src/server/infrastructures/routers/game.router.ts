/* eslint-disable new-cap */
import { Router } from 'express';
import GameController from '../../application/controllers/game.controller.js';
import { Interceptors } from '../../application/interceptors/interceptors.js';
import ServerRouter from '../../Server.router.interface.js';

export default class GameRouter implements ServerRouter {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  path: string = '/games';
  interceptor: Interceptors = new Interceptors();
  router: Router = Router();

  constructor(private controller: GameController) {
    this.registerControllers();
  }

  registerControllers(): void {
    this.router.get(
      '/',
      this.interceptor.logged,
      this.controller.findAllGame.bind(this.controller)
    );
    this.router.get(
      '/',
      this.interceptor.logged,
      this.controller.searchGame.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.interceptor.logged,
      // This.controller.findGame.bind(this.controller)
    );
    this.router.post(
      '/',
      this.interceptor.logged,
      this.controller.createGame.bind(this.controller)
    );
    this.router.put(
      '/:id',
      this.interceptor.logged,
      this.controller.updateGame.bind(this.controller)
    );
    this.router.delete(
      '/:id',
      this.interceptor.logged,
      this.controller.deleteGame.bind(this.controller)
    );
  }
}
