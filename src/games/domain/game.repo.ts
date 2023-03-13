import Game from './game.js';

export default interface GameRepository {
  create: (game: Game) => Promise<void>;
  update: (game: Partial<Game>) => Promise<void>;
  find: (id: string) => Promise<Game | null>;
  search: () => Promise<Game[]>;
  delete: (id: string) => Promise<void>;
}
