import GameRepository from "../domain/game.repo.model.js";

export default class GameDeleter {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
