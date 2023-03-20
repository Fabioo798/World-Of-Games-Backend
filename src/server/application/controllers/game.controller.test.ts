import { NextFunction, Request, Response } from 'express';
import { RequestPlus } from '../../../commons/interfaces';
import GameCreator from '../../../games/application/gamecreator';
import GameDeleter from '../../../games/application/gamedeleter';
import GameFinder from '../../../games/application/gamefinder';
import GameFinderAll from '../../../games/application/gamefinderall';
import GameSearcher from '../../../games/application/gamesearcher';
import GameUpdater from '../../../games/application/gameupdater';
import GameRepository from '../../../games/domain/game.repo.model';
import UserFinder from '../../../user/application/userfinder';
import UserUpdater from '../../../user/application/userupdater';
import User from '../../../user/domain/user.model';
import UserRepository from '../../../user/domain/user.model.repo';
import GameController from './game.controller';

const res = {
  json: jest.fn(),
  status: jest.fn(),
} as unknown as Response;

const next = jest.fn() as unknown as NextFunction;

const mockRepo = {
  create: jest.fn(),
  search: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as GameRepository;

const mockUserRepo = {
  find: jest.fn(),
  update: jest.fn(),
} as unknown as UserRepository;

const mockGameCreator = new GameCreator(mockRepo);
const mockGameSearcher = new GameSearcher(mockRepo);
const mockGameFinderAll = new GameFinderAll(mockRepo);
const mockGameFinder = new GameFinder(mockRepo);
const mockGameUpdate = new GameUpdater(mockRepo);
const mockGameDeleter = new GameDeleter(mockRepo);
const mockUserFinder = new UserFinder(mockUserRepo);
const mockUserUpdate = new UserUpdater(mockUserRepo);

describe('Given GameController class', () => {
  const mockUser = {
    name: 'test',
    email: 'test',
  } as unknown as User;

  const pass = 'test';

  const controller = new GameController(
    mockGameCreator,
    mockGameFinderAll,
    mockGameFinder,
    mockGameSearcher,
    mockGameUpdate,
    mockGameDeleter,
    mockUserFinder,
    mockUserUpdate
  );
  beforeEach(() => {
    (mockUserRepo.find as jest.Mock).mockReturnValue(mockUser);
    (mockUserRepo.update as jest.Mock).mockReturnValue(mockUser);
  });
  describe('When it is instanced', () => {
    test('Then it should call the GameController', () => {
      expect(controller).toBeInstanceOf(GameController);
    });
  });

  describe('When createGame method is called', () => {
    test('Then if the Game information is completed, it should return the resp.satus and resp.json', async () => {
      const req1 = {
        body: {
          gameName: 'test',
          category: 'MMO',
          releaseDate: 'test',
          img: 'test',
        },
        info: {
          id: 'test',
          email: 'test',
          role: 'test',
        },
      } as unknown as RequestPlus;
      const mockData = (mockUserRepo.find as jest.Mock).mockReturnValue({id: 'test',
      name: 'test',
      email: 'test',
      password: pass,
      shopList: [],
      myGames: [],
      img: 'test',
      address: 'test',
      notification: []});
      req1.body.owner = mockData;
      await controller.createGame(req1, res, next);
      (mockUserRepo.update as jest.Mock).mockResolvedValue(mockUser);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test('Then if game information in the body, has not  name, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          gameName: null,
          category: 'MMO',
          releaseDate: 'test',
          img: 'test',
        },
        info: {
          id: 'test',
          name: 'test',
        },
      } as unknown as RequestPlus;
      await controller.createGame(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the Game info is INcompleted it should return next', async () => {
      const req = {
        body: {
          gameName: 'test',
          releaseDate: 'test',
          img: 'test',
        },
      } as unknown as Request;

      await controller.createGame(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When findGame method is called', () => {
    test('Then if the Game info is completed it should return the status and json', async () => {
      const req = {
        params: {
          id: '1',
        },
      } as unknown as Request;
      await controller.findGame(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
    test('Then if the Game info is INcompleted it should return next', async () => {
      const req = {} as unknown as Request;

      await controller.findGame(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When findAllGame method is called', () => {
    test('Then if the Game info is completed it should return the status and json', async () => {
      const req = {} as unknown as Request;

      await controller.findAllGame(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
    test('Then if the Game info is INcompleted it should return next', async () => {
      const req = null as unknown as Request;

      await controller.findAllGame(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When searchGame method is called', () => {
    test('Then if the Game information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          category: 'MMO',
          gameName: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue(['MMO']);

      await controller.searchGame(req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });
  describe('When searchGame method is called', () => {
    test('Then if the Game information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          gameName: 'test',
        },
      } as unknown as Request;

      await controller.searchGame(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When call the updateGame method', () => {
    describe('When all params are correct', () => {
      test('Then it should call resp.json', async () => {
        const req = {
          body: { gameName: 'test', releaseDate: 'test', img: 'test' },
          info: { id: '1' },
          params: { id: '1' },
        } as unknown as RequestPlus;
        (mockRepo.update as jest.Mock).mockResolvedValue({ id: '1' });
        await controller.updateGame(req, res, next);
        expect(res.json).toHaveBeenCalled();
      });
    });

    describe('When updateGame fails', () => {
      test('Then it should call next', async () => {
        const req = {
          body: { name: 'test', email: 'Test', password: pass},
          params: { id: '1' },
        } as unknown as RequestPlus;
        (mockRepo.update as jest.Mock).mockResolvedValue(undefined);

        await controller.updateGame(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When there is no req.info.id', () => {
      test('Then it should call next', async () => {
        const req = {
          body: { name: 'test', email: 'Test', password: pass},
          info: { id: '1' },
        } as unknown as RequestPlus;
        await controller.updateGame(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe('When deleteGame method is called', () => {
    test('Then if the id is found it should respond with status', async () => {
      const req = {
        body: { gameName: 'test', releaseDate: 'test', img: 'test' },
        info: { id: '1' },
        params: { id: '1' },
      } as unknown as RequestPlus;

      (mockRepo.delete as jest.Mock).mockResolvedValue({ id: '1' });
      await controller.deleteGame(req, res, next);
      expect(res.status).toHaveBeenCalled();
    });
  });
});
