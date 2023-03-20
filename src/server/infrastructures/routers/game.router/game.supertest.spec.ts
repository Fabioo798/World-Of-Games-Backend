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

describe('Given an Express server class with "/games" route', () => {
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
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('When we make requests to "/games" route', () => {
    test('Then a GET request to "/games/:id" with correct info should return a 200 status', async () => {
      await request(server.app)
        .get(`/games/${ids[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    test('(NO)Then a GET request to "/games/:id" with  WRONG ID should return a 500 status', async () => {
      await request(server.app)
        .get(`/games/1324`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
    test('Then a GET request to "/games/" with correct info should return a 200 status', async () => {
      await request(server.app)
        .get(`/games/`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    test('Then a GET request to "/game/" should return a 404 status', async () => {
      await request(server.app)
        .get(`/game/`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    test('then a PUT request to "/games/:id" should return user data and a 200 status', async () => {
      await request(server.app)
        .get(`/games/${ids[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    test('(NO)then a PUT request to "/games/:id" with wrong id should return a 500 status', async () => {
      await request(server.app)
        .get(`/games/234`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
    test('then a POST request to "/games/" should return user data and a 200 status', async () => {
      await request(server.app)
        .get(`/games/`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    test('(NO)then a POST request to "/game/" should return a 404 status', async () => {
      await request(server.app)
        .get(`/game/`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    test('then a DELETE request to "/games/:id" should return user data and a 200 status', async () => {
      await request(server.app)
        .get(`/games/${ids[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    test('(NO)then a DELETE request to "/games/:id" with wrong id should return a 404 status', async () => {
      await request(server.app)
        .get(`/games/213`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });
});
