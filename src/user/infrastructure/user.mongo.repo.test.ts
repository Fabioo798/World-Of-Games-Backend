import UserMongoRepo from './user.mongo.repo.js';
import { UserModel } from '../../server/domain/user.schema.js';
import User from '../domain/user.model.js';

jest.mock('../../server/domain/user.schema');

const mockModel = {
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
} as unknown as typeof UserModel;

const pass = 'test1';

const mockUser = {
  id: '2',
  email: 'test',
  password: pass,
} as User;

describe('Given the UserMongoRepo', () => {
  const repo = new UserMongoRepo(mockModel);

  describe('When it is called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserMongoRepo);
    });
  });

  describe('When create method is called', () => {
    test('Then it should create an user', async () => {
      (mockModel.create as jest.Mock).mockResolvedValue(mockUser);

      await repo.create(mockUser);

      expect(mockModel.create).toHaveBeenCalled();
    });
  });
  describe('When update method is called', () => {
    test('Then it should update an user', async () => {
      (mockModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      await repo.update(mockUser);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
  describe('When find method is called', () => {
    test('Then it should find an user', async () => {
      (mockModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await repo.find('2');

      expect(mockModel.findById).toHaveBeenCalled();
    });
  });
  describe('When delete method is called', () => {
    test('Then it should delete an user', async () => {
      (mockModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      await repo.delete('2');

      expect(mockModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
  describe('When search method is called', () => {
    test('Then it should search an user', async () => {
      (mockModel.find as jest.Mock).mockResolvedValue(mockUser);

      await repo.search({ key: 'email', value: 'test' });

      expect(mockModel.find).toHaveBeenCalled();
    });
  });
});
