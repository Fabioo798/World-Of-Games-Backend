import GameController from '../../application/controllers/game.controller.js';
import GameRouter from './game.router.js';

const mockController = {
  findOneGame: jest.fn(),
  findAllGame: jest.fn(),
  createGame: jest.fn(),
  updateGame: jest.fn(),
  deleteGame: jest.fn(),
  searchGame: jest.fn(),
} as unknown as GameController;

describe('Given the userRouter class', () => {
  describe('When is instanced', () => {
    test('Then', () => {
      const router = new GameRouter(mockController);
      expect(router).toBeInstanceOf(GameRouter);
    });
  });
});
