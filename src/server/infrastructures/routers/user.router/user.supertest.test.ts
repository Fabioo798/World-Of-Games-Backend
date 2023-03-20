/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import request from 'supertest';
import { TokenPayload } from '../../../../commons/interfaces';
import { Auth } from '../../../application/auth/auth';
import { UserModel } from '../../../domain/user.schema';
import { dbConnect } from '../../db/db.connect';
import ExpressServer from '../../../express.server.js';
import { UserController } from '../../../application/controllers/user.controller';
import UserRouter from './user.router';
import UserCreator from '../../../../user/application/usercreator';
import UserDeleter from '../../../../user/application/userdeleter';
import UserFinder from '../../../../user/application/userfinder';
import UserSearcher from '../../../../user/application/usersearcher';
import UserUpdater from '../../../../user/application/userupdater';
import UserMongoRepo from '../../../../user/infrastructure/user.mongo.repo';
import User from '../../../../user/domain/user.model';

const repo = new UserMongoRepo(UserModel);

let setUp: request.SuperTest<any>;
let credentials: Partial<User>;
let wrongCredentials: Partial<User>;
let header: any;
let bearer: any;
let ok: any;
let notOk: any;

const userCreator = new UserCreator(repo);
const userFinder = new UserFinder(repo);
const userSearcher = new UserSearcher(repo);
const userUpdater = new UserUpdater(repo);
const userDeleter = new UserDeleter(repo);

const pass = 'test';

const setCollection = async () => {
  const databaseMock = [
    {
      name: 'maria',
      email: 'maria@test.it',
      password: pass,
      shopList: [],
      myGames: [],
      img: 'test',
      address: 'test1',
      notification: [],
    },
    {
      name: 'angelo',
      email: 'angelo@test.it',
      password: pass,
      shopList: [],
      myGames: [],
      img: 'test',
      address: 'test',
      notification: [],
    },
  ];
  await UserModel.deleteMany();
  await UserModel.insertMany(databaseMock);
  const data = await UserModel.find();
  const testIds = [data[0].id, data[1].id];
  return testIds;
};

describe('Given the Express server class with "/users" route', () => {
  let server1: ExpressServer;
  let token1: string;
  let ids1: Array<string>;

  beforeAll(async () => {
    await dbConnect();
    ids1 = await setCollection();
    const payload: TokenPayload = {
      id: ids1[1],
      name: 'angelo',
      role: 'admin',
      email: 'angelo@test.it',
    };
    token1 = Auth.createJWT(payload);
    const userRouter = new UserRouter(
      new UserController(
        userCreator,
        userFinder,
        userSearcher,
        userUpdater,
        userDeleter
      )
    );
    server1 = new ExpressServer([userRouter]);
    setUp = await request(server1.app);

    credentials = {
      email: 'newuser@test.it',
      password: pass,
    };
    wrongCredentials = {
      email: 'newuser@test.it',
      password: pass,
    };
    header = 'Authorization';
    bearer = `Bearer ${token1}`;

    ok = setUp.get(`/users/${ids1[0]}`).set(header, bearer).expect(200);
    notOk = await setUp.get(`/users/123`).set(header, bearer).expect(500);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('when we make requests to "/users" route', () => {
    test('then our POST request to "/users/register" should create a new user and send back a 201 status', async () => {
      const newUser = {
        name: 'newuser',
        email: 'newuser@test.it',
        password: pass,
        shopList: [],
        myGames: [],
        img: 'test1',
        address: 'test',
        notification: [],
      };

      await setUp.post('/users/register').send(newUser).expect(201);
    });
    test('(NO)then a POST request to "/users/register"  with missing info should throw 401', async () => {
      const newUser = {
        password: pass,
        shopList: [],
        myGames: [],
        img: 'test',
        address: 'test',
        notification: [],
      };

      await setUp.post('/users/register').send(newUser).expect(401);
    });
  });

  test('if the POST request to "/users/login" should return a token and a 200 status', async () => {
    await setUp
      .post('/users/login')
      .set(header, bearer)
      .send(credentials)
      .expect(202);
  });
  it('ERROR then our POST request to "/users/login" must return a 401 status', async () => {
    await setUp
      .post('/users/loin')
      .set(header, bearer)
      .send(wrongCredentials)
      .expect(404);
  });

  test('then the GET request  will send us back user data and a 200 status', async () => {
    await ok;
  });
  it('(NO) a GET request with wrong id should return a 500 status', async () => {
    await notOk;
  });
  test('if our PUT request must send user data and a 200 status', async () => {
    await ok;
  });
  it('ERROR the PUT request should throw 500 status', async () => {
    await notOk;
  });
  test('then our DELETE request should send back user data and a 200 status', async () => {
    await ok;
  });
  it('(NO) the DELETE request must return a 500 status', async () => {
    await notOk;
  });
});
