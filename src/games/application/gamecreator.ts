import Game from "../domain/game.model.js";
import GameRepository from "../domain/game.repo.model.js";

export default class GameCreator {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(user: Game): Promise<Game> {
    const data = await this.repository.create(user);
    return data;
  }
}
