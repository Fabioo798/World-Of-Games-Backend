import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';

export default class GameFinder {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(id: string): Promise<Game | null> {
    // eslint-disable-next-line no-return-await
    return await this.repository.findOne(id);
  }
}
