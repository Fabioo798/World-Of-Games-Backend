import Game from "../domain/game.model.js";
import GameRepository from "../domain/game.repo.model.js";
import GameDeleter from "./gamedeleter.js";

const mockRepo = {
  delete: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;

describe('Given the GameDeleter class', () => {
  const repo = new GameDeleter(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameDeleter);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create Game repo method should called', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute('2');

      expect(mockRepo.delete).toHaveBeenCalled();
    });
  });
});
