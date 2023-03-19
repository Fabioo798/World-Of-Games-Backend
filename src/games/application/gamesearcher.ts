import Game from "../domain/game.model.js";
import GameRepository from "../domain/game.repo.model.js";

export default class GameSearcher {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(query: { key: string; value: unknown }): Promise<Game[]> {
    const response = await this.repository.search(query);
    return response;
  }
}
