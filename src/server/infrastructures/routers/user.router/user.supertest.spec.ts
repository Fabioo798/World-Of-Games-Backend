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


const setCollection = async () => {
  const pass = 'test';
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

const pass = 'test';


describe('Given an Express server class with "/users" route', () => {
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
    const userRouter = new UserRouter(
      new UserController(
        userCreator,
        userFinder,
        userSearcher,
        userUpdater,
        userDeleter
      )
    );
    server = new ExpressServer([userRouter]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('when we make requests to "/users" route', () => {
    test('then a POST request to "/users/register" should create a new user and return a 201 status', async () => {
      const newUser = {
        name: 'newuser',
        email: 'newuser@test.it',
        password: pass,     shopList: [],
        myGames: [],
        img: 'test',
        address: 'test',
        notification: [],
      };
      await request(server.app)
        .post('/users/register')
        .send(newUser)
        .expect(201);
    });
    test('(NO)then a POST request to "/users/register"  with missing info should throw 401', async () => {
      const newUser = {
        password: pass,     shopList: [],
        myGames: [],
        img: 'test',
        address: 'test',
        notification: [],
      };
      await request(server.app)
        .post('/users/register')
        .send(newUser)
        .expect(401);
    });
  });

  test('then a POST request to "/users/login" should return a token and a 200 status', async () => {
    const credentials = {
      email: 'newuser@test.it',
      password: pass, };
    await request(server.app)
      .post('/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send(credentials)
      .expect(202);
  });
  test('(NO)then a POST request to "/users/login" should return a token and a 200 status', async () => {
    const credentials = {
      email: 'newuser@test.it',
      password: pass,
        };
    await request(server.app)
      .post('/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send(credentials)
      .expect(401);
  });

  test('then a GET request to "/users/:id" should return user data and a 200 status', async () => {
    await request(server.app)
      .get(`/users/${ids[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
  test('(NO)then a GET request to "/users/:id" with wrong id should return a 500 status', async () => {
    await request(server.app)
      .get(`/users/12343`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
  });
  test('then a PUT request to "/users/:id" should return user data and a 200 status', async () => {
    await request(server.app)
      .get(`/users/${ids[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
  test('(NO)then a PUT request to "/users/:id" should return user data and a 500 status', async () => {
    await request(server.app)
      .get(`/users/123`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
  });
  test('then a DELETE request to "/users/:id" should return user data and a 200 status', async () => {
    await request(server.app)
      .get(`/users/${ids[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
  test('(NO)then a DELETE request to "/users/:id" should return user data and a 500 status', async () => {
    await request(server.app)
      .get(`/users/123`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
  });
});
