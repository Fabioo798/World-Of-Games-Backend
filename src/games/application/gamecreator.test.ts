import Game from "../domain/game.model.js";
import GameRepository from "../domain/game.repo.model.js";
import GameCreator from "./gamecreator.js";

const mockRepo = {
  create: jest.fn(),
} as unknown as GameRepository;

const mockGame = {
  id: '2',
  gameName: 'test',
  category: 'MMO',
} as unknown as Game;

describe('Given the GameCreator class', () => {
  const repo = new GameCreator(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(GameCreator);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create Game repo method should called', async () => {
      (mockRepo.create as jest.Mock).mockResolvedValue(mockGame);

      await repo.execute(mockGame);

      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});
