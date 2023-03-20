import Game from './game.model.js';

export default interface GameRepository {
  create: (game: Game) => Promise<Game>;
  update: (game: Partial<Game>) => Promise<void>;
  findAll: () => Promise<Game[]>;
  findOne: (id: string) => Promise<Game | null>;
  search: (query: { key: string; value: unknown }) => Promise<Game[]>;
  delete: (id: string) => Promise<void>;
}
