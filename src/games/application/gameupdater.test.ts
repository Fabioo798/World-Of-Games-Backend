import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';
import GameUpdater from './gameupdater.js';

const mockRepo = {
  update: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;

describe('Given the GameUpdater class', () => {
  const repo = new  GameUpdater(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameUpdater);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the search Game repo method should called', async () => {
      (mockRepo.update as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute(mockGame);

      expect(mockRepo.update).toHaveBeenCalled();
    });
  });
});
