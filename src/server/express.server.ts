import express, { Express } from 'express';
import { dbConnect } from './infrastructures/db/db.connect.js';
import ServerRouter from './Server.router.interface.js';
import createDebug from 'debug';
import cors from 'cors';

const routes = [
  { endpoint: 'users/register', method: 'POST' },
  { endpoint: 'users/login', method: 'POST' },
  { endpoint: '/users/:userId', method: 'GET' },
  { endpoint: '/users/:userId', method: 'PUT' },
  { endpoint: '/users/:userId', method: 'DELETE' },
  { endpoint: '/games', method: 'GET' },
  { endpoint: '/games/:id', method: 'GET' },
  { endpoint: '/games', method: 'POST' },
  { endpoint: '/games/:id', method: 'PUT' },
  { endpoint: '/games/:id', method: 'DELETE' },
];

const debug = createDebug('WOG: express server');

export default class ExpressServer {
  app: Express;

  constructor(private routers: ServerRouter[]) {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.use(express.json());
    this.app.use(cors({ origin: '*' }));
  }

  routes(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.get('/', (req, res, _next) => {
      res.json(routes);
    });
    this.routers.forEach((router) => {
      this.app.use(router.path, router.router);
    });
  }

  start(port: number): void {
    dbConnect().then((mongoose) => {
      this.app.listen(port, () => {
        debug(
          `Server running on post ${port}`,
          mongoose.connection.db.databaseName
        );
      });
    });
  }
}
