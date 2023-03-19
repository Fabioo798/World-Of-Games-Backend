import express, { Express } from 'express';
import { dbConnect } from './infrastructures/db/db.connect.js';
import ServerRouter from './Server.router.interface.js';

export default class ExpressServer {
  app: Express;

  constructor(private routers: ServerRouter[]) {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.use(express.json());
  }

  routes(): void {
    this.routers.forEach((router) => {
      this.app.use(router.path, router.router);
    });
  }

  start(port: number): void {
    dbConnect().then((mongoose) => {
      this.app.listen(port, () => {
        console.log(
          `Server running on post ${port}`,
          mongoose.connection.db.databaseName
        );
      });
    });
  }
}