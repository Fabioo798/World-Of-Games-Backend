import GameCreator from '../../../games/application/gamecreator.js';
import GameDeleter from '../../../games/application/gamedeleter.js';
import GameFinder from '../../../games/application/gamefinder.js';
import GameSearcher from '../../../games/application/gamesearcher.js';
import GameUpdater from '../../../games/application/gameupdater.js';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import GameFinderAll from '../../../games/application/gamefinderall.js';
import { HTTPError } from '../../../commons/error.js';
import { RequestPlus } from '../../../commons/interfaces.js';
import UserFinder from '../../../user/application/userfinder.js';
import UserUpdater from '../../../user/application/userupdater.js';
import User from '../../../user/domain/user.model.js';

const debug = createDebug('WOF: user controller');

export default class GameController {
  // eslint-disable-next-line max-params
  constructor(
    private gameCreator: GameCreator,
    private gameFinderAll: GameFinderAll,
    private gameFinder: GameFinder,
    private gameSearcher: GameSearcher,
    private gameUpdater: GameUpdater,
    private gameDeleter: GameDeleter,
    private userFinder: UserFinder,
    private userUpdate: UserUpdater
  ) {
    debug('Game controller instantiated');
  }

  async createGame(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('createGame');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser: User = await this.userFinder.execute(userId);

      if (
        !req.body.gameName ||
        !req.body.category ||
        !req.body.img ||
        !req.body.releaseDate
      )
        throw new HTTPError(
          401,
          'Unauthorized',
          'Invalid Name, category, img or release date'
        );

      req.body.owner = actualUser;
      const data = await this.gameCreator.execute(req.body);
      actualUser.myGames.push(data);
      await this.userUpdate.execute(actualUser);
      res.status(200);
      res.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async findGame(req: Request, res: Response, next: NextFunction) {
    try {
      debug('findGame');
      const { id } = req.params;
      const response = await this.gameFinder.execute(id);

      res.status(200);
      res.json({ results: [response] });
    } catch (error) {
      next(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAllGame(req: Request, res: Response, _next: NextFunction) {
    debug('findUser');
    const response = await this.gameFinderAll.execute();

    res.status(200);
    res.json({ results: [response] });
  }

  async searchGame(req: Request, res: Response, next: NextFunction) {
    try {
      debug('searchGame');
      if (!req.body.category)
        throw new HTTPError(404, 'Missing category', 'no category in the body');
      const response = await this.gameSearcher.execute({
        key: 'category',
        value: req.body.category,
      });

      res.status(200);
      res.json({ results: [response] });
    } catch (error) {
      next(error);
    }
  }

  async updateGame(req: Request, res: Response, next: NextFunction) {
    try {
      debug('updateGame');
      const { id } = req.params;
      const { body } = req;

      const newGame = {
        id,
        ...body,
      };

      await this.gameUpdater.execute(newGame);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async deleteGame(req: Request, res: Response, next: NextFunction) {
    try {
      debug('deleteGame');
      const { id } = req.params;

      await this.gameDeleter.execute(id);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
