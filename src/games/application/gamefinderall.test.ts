import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';
import GameFinderAll from './gamefinderall.js';

const mockRepo = {
  findAll: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;

describe('Given the GameCreator class', () => {
  const repo = new GameFinderAll(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameFinderAll);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create Game repo method should called', async () => {
      (mockRepo.findAll as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute();

      expect(mockRepo.findAll).toHaveBeenCalled();
    });
  });
});
