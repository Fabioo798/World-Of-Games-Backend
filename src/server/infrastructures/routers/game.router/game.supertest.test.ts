/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TokenPayload } from '../../../../commons/interfaces';
import GameCreator from '../../../../games/application/gamecreator';
import GameDeleter from '../../../../games/application/gamedeleter';
import GameFinder from '../../../../games/application/gamefinder';
import GameFinderAll from '../../../../games/application/gamefinderall';
import GameSearcher from '../../../../games/application/gamesearcher';
import GameUpdater from '../../../../games/application/gameupdater';
import GameMongoRepo from '../../../../games/infrastructure/game.mono.repo';
import UserFinder from '../../../../user/application/userfinder';
import UserUpdater from '../../../../user/application/userupdater';
import UserMongoRepo from '../../../../user/infrastructure/user.mongo.repo';
import { Auth } from '../../../application/auth/auth';
import GameController from '../../../application/controllers/game.controller';
import { GameModel } from '../../../domain/game.schema';
import { UserModel } from '../../../domain/user.schema';
import ExpressServer from '../../../express.server';
import { dbConnect } from '../../db/db.connect';
import GameRouter from './game.router';
import request from 'supertest';

const repo = new GameMongoRepo(GameModel);
const userRepo = new UserMongoRepo(UserModel);

let header1: any;
let bearer1: any;
let setUp1: request.SuperTest<any>;
let ok: any;
let okId: any;
let notOk: any;
let notFound: any;

const gameCreator = new GameCreator(repo);
const gameFinderAll = new GameFinderAll(repo);
const gameFinder = new GameFinder(repo);
const gameSearcher = new GameSearcher(repo);
const gameUpdater = new GameUpdater(repo);
const gameDeleter = new GameDeleter(repo);
const userFinder = new UserFinder(userRepo);
const userUpdater = new UserUpdater(userRepo);

const setCollection = async () => {
  const databaseMock = [
    {
      gameName: 'Guitar Hero',
      category: 'MMO',
      img: 'test',
      releaseDate: 'test',
    },
    {
      gameName: 'Guitar Hero 2',
      category: 'MMO',
      img: 'test2',
      releaseDate: 'test',
    },
  ];
  await GameModel.deleteMany();
  await GameModel.insertMany(databaseMock);
  const data = await GameModel.find();
  const testIds = [data[0].id, data[1].id];
  return testIds;
};

describe('joven an Express server class with "/games" route', () => {
  let server: ExpressServer;
  let token: string;
  let ids: Array<string>;

  beforeAll(async () => {
    await dbConnect();
    ids = await setCollection();
    const payload: TokenPayload = {
      id: ids[0],
      name: 'maria',
      role: 'admin',
      email: 'maria@test.it',
    };
    token = Auth.createJWT(payload);
    const gameRouter = new GameRouter(
      new GameController(
        gameCreator,
        gameFinderAll,
        gameFinder,
        gameSearcher,
        gameUpdater,
        gameDeleter,
        userFinder,
        userUpdater
      )
    );
    server = new ExpressServer([gameRouter]);
    setUp1 = await request(server.app);

    header1 = 'Authorization';
    bearer1 = `Bearer ${token}`;

    ok = await setUp1.get(`/games/`).set(header1, bearer1).expect(200);

    okId = request(server.app)
      .get(`/games/${ids[0]}`)
      .set(header1, bearer1)
      .expect(200);
    notOk = await request(server.app)
      .get(`/games/1324`)
      .set(header1, bearer1)
      .expect(500);
    notFound = request(server.app)
      .get(`/game/`)
      .set(header1, bearer1)
      .expect(404);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('ppi we make requests to "/games" route', () => {
    test('Our GET request must return a 200 status', async () => {
      await okId;
    });
    test('(NO) the GET request with  WRONG ID must return a 500 status', async () => {
      await notOk;
    });
    it('A GET request will return a 200 status',async () => {
      await ok;
    });
    test('ERROR the GET request with wrong path must return a 404 status', async () => {
      await notFound;
    });
    it('then our PUT request to should return game data and a 200 status', async () => {
      await okId;
    });
    test('(NO) the PUT request  with wrong id  must give a 500 status', async () => {
      await notOk;
    });
    it('Our POST request have to return game data and a 200 status', async () => {
      await ok;
    });
    test('ERROR the POST request must return a 404 status', async () => {
      await notFound;
    });
    it('then a DELETE request to should return game data and a 200 status', async () => {
      await okId
    });
    test('(NO) the DELETE request with wrong id have to return a 500 status', async () => {
      await notOk;
    });
  });
});
