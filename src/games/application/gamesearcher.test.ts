import Game from "../domain/game.model.js";
import GameRepository from "../domain/game.repo.model.js";
import GameSearcher from "./gamesearcher.js";

const mockRepo = {
  search: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as Game;
describe('Given the GameSearcher class', () => {
  const repo = new GameSearcher(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameSearcher);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the search Game repo method should called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute({ key: 'category', value: 'MMO' });

      expect(mockRepo.search).toHaveBeenCalled();
    });
  });
});
