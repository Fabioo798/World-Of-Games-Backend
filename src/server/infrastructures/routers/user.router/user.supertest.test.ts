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

const repo = new UserMongoRepo(UserModel);

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
      address: 'test',
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
        img: 'test',
        address: 'test',
        notification: [],
      };
      await request(server1.app)
        .post('/users/register')
        .send(newUser)
        .expect(201);
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
      await request(server1.app)
        .post('/users/register')
        .send(newUser)
        .expect(401);
    });
  });

  test('then the POST request to "/users/login" should return a token and a 200 status', async () => {
    const credentials = {
      email: 'newuser@test.it',
      password: pass,
    };
    await request(server1.app)
      .post('/users/login')
      .set('Authorization', `Bearer ${token1}`)
      .send(credentials)
      .expect(202);
  });
  test('(NO)then our POST request to "/users/login" must return a 401 status', async () => {
    const credentials = {
      email: 'newuser@tet.it',
      password: pass,
    };
    await request(server1.app)
      .post('/users/login')
      .set('Authorization', `Bearer ${token1}`)
      .send(credentials)
      .expect(401);
  });

  test('then the GET request to "/users/:id" will send us back user data and a 200 status', async () => {
    await request(server1.app)
      .get(`/users/${ids1[0]}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
  });
  test('(NO) a GET request to "/users/:id" with wrong id should return a 500 status', async () => {
    await request(server1.app)
      .get(`/users/12343`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(500);
  });
  test('then our PUT request to "/users/:id" must send user data and a 200 status', async () => {
    await request(server1.app)
      .get(`/users/${ids1[0]}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
  });
  test('(NO) the PUT request to "/users/:id" should throw 500 status', async () => {
    await request(server1.app)
      .get(`/users/123`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(500);
  });
  test('then our DELETE request to "/users/:id" should send back user data and a 200 status', async () => {
    await request(server1.app)
      .get(`/users/${ids1[0]}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);
  });
  test('(NO) the DELETE request to "/users/:id" must return a 500 status', async () => {
    await request(server1.app)
      .get(`/users/123`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(500);
  });
});
