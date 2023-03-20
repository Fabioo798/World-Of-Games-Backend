import Game from '../domain/game.model.js';
import GameRepository from '../domain/game.repo.model.js';

export default class GameUpdater {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: GameRepository) {}

  async execute(user: Partial<Game>): Promise<void> {
    await this.repository.update(user);
  }
}
