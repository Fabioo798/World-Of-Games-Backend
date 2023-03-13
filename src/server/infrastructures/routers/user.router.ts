/* eslint-disable new-cap */
import { Router } from 'express';
import UserCreator from '../../../user/application/usercreator.js';
import UserDeleter from '../../../user/application/userdeleter.js';
import UserFinder from '../../../user/application/userfinder.js';
import UserUpdater from '../../../user/application/userupdater.js';
import UserSearcher from '../../../user/application/usersearcher.js';
import { Interceptors } from '../../application/interceptors.js';
import { HTTPError } from '../../../commons/error.js';
import { Auth } from '../../application/auth.js';
import ServerRouter from '../../Server.router.interface.js';
import { TokenPayload } from '../../../commons/interfaces.js';

export default class UserRouter implements ServerRouter {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  path: string = '/users';
  interceptor: Interceptors = new Interceptors();
  router: Router = Router();

  constructor(
    private userFinder: UserFinder,
    private userCreator: UserCreator,
    private userSearcher: UserSearcher,
    private userUpdater: UserUpdater,
    private userDeleter: UserDeleter
  ) {
    this.registerControllers();
  }

  registerControllers(): void {
    this.router.get(`/:id`, async (req, res, _next) => {
      const { id } = req.params;
      const response = await this.userFinder.execute(id);

      res.status(200).json(response);
    });

    this.router.post('/register', async (req, res, next) => {
      try {
        const { body } = req;

        if (
          !req.body.email ||
          !req.body.password ||
          !req.body.name ||
          !req.body.img
        )
          throw new HTTPError(
            401,
            'Unauthorized',
            'Invalid Name, Email or password'
          );

        req.body.password = await Auth.hash(req.body.password);

        req.body.cart = [];
        req.body.myGames = [];

        const data = await this.userCreator.execute(body);

        res.status(201);
        res.json({
          results: [data],
        });
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/login', async (req, res, next) => {
      try {
        if (!req.body.email || !req.body.password)
          throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');

        const data = await this.userSearcher.execute({
          key: 'email',
          value: req.body.email,
        });

        if (!data.length)
          throw new HTTPError(401, 'Unauthorized', 'username not found');

        if (!(await Auth.compare(req.body.password, data[0].password)))
          throw new HTTPError(401, 'Unauthorized', 'Password not match');

        const payload: TokenPayload = {
          id: data[0].id,
          email: data[0].email,
          role: 'Admin',
        };

        const token = Auth.createJWT(payload);
        res.status(202);
        res.json({
          results: {
            token,
          },
        });
      } catch (error) {
        next(error);
      }
    });

    this.router.get('/:id', this.interceptor.logged, async (req, res, next) => {
      try {
        const { id } = req.params;
        const response = await this.userFinder.execute(id);

        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    });

    this.router.put('/:id', this.interceptor.logged, async (req, res, next) => {
      try {
        const { id } = req.params;
        const { body } = req;

        const newUser = {
          id,
          ...body,
        };

        await this.userUpdater.execute(newUser);

        res.sendStatus(200);
      } catch (error) {
        next(error);
      }
    });

    this.router.delete(
      '/:id',
      this.interceptor.logged,
      async (req, res, next) => {
        try {
          const { id } = req.params;

          await this.userDeleter.execute(id);

          res.sendStatus(204);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
