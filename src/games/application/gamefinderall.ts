import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';

export default class GameFinderAll {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(): Promise<Game[]> {
    // eslint-disable-next-line no-return-await
    return await this.repository.findAll();
  }
}
