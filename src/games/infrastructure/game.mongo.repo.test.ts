import { GameModel } from '../../server/domain/game.schema.js';
import Game from '../domain/game.model.js';
import GameMongoRepo from './game.mono.repo.js';

jest.mock('../../server/domain/game.schema.js');

const mockModel = {
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
} as unknown as typeof GameModel;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;

describe('Given the GameMongoRepo', () => {
  const repo = new GameMongoRepo(mockModel);

  describe('When it is called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameMongoRepo);
    });
  });

  describe('When create method is called', () => {
    test('Then it should create an Game', async () => {
      (mockModel.create as jest.Mock).mockResolvedValue(mockGame);

      await repo.create(mockGame);

      expect(mockModel.create).toHaveBeenCalled();
    });
  });
  describe('When update method is called', () => {
    test('Then it should update an Game', async () => {
      (mockModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockGame);

      await repo.update(mockGame);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
  describe('When findOne method is called', () => {
    test('Then it should find an Game', async () => {
      (mockModel.findById as jest.Mock).mockResolvedValue(mockGame);

      await repo.findOne('2');

      expect(mockModel.findById).toHaveBeenCalled();
    });
  });
  describe('When findAll method is called', () => {
    test('Then it should find an Game', async () => {
      (mockModel.find as jest.Mock).mockResolvedValue(mockGame);

      await repo.findAll();

      expect(mockModel.find).toHaveBeenCalled();
    });
  });
  describe('When delete method is called', () => {
    test('Then it should delete an Game', async () => {
      (mockModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockGame);

      await repo.delete('2');

      expect(mockModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
  describe('When search method is called', () => {
    test('Then it should search an Game', async () => {
      (mockModel.find as jest.Mock).mockResolvedValue(mockGame);

      await repo.search({ key: 'category', value: 'MMO' });

      expect(mockModel.find).toHaveBeenCalled();
    });
  });
});
