import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';
import GameFinder from './gamefinder.js';

const mockRepo = {
  findOne: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;

describe('Given the GameFinder class', () => {
  const repo = new GameFinder(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameFinder);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create Game repo method should called', async () => {
      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute('2');

      expect(mockRepo.findOne).toHaveBeenCalled();
    });
  });
});
