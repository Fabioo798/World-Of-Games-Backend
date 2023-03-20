/* eslint-disable new-cap */
import { Router } from 'express';
import { UserController } from '../../../application/controllers/user.controller.js';
import { Interceptors } from '../../../application/interceptors/interceptors.js';
import ServerRouter from '../../../Server.router.interface.js';

export default class UserRouter implements ServerRouter {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  path: string = '/users';
  interceptor: Interceptors = new Interceptors();
  router: Router = Router();

  constructor(private controller: UserController) {
    this.registerControllers();
  }

  registerControllers(): void {
    this.router.post(
      '/register',
      this.controller.registerUser.bind(this.controller)
    );
    this.router.post('/login', this.controller.loginUser.bind(this.controller));
    this.router.get(
      '/:id',
      this.interceptor.logged,
      this.controller.findUser.bind(this.controller)
    );
    this.router.put(
      '/:id',
      this.interceptor.logged,
      this.controller.updateUser.bind(this.controller)
    );
    this.router.delete(
      '/:id',
      this.interceptor.logged,
      this.controller.deleteUser.bind(this.controller)
    );
  }
}
