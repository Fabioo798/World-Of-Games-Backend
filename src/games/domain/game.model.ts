import User from '../../user/domain/user.model.js';

export type gameCategory = 'MOBA' | 'RPG' | 'MMO' | 'FPS';

export default class Game {
  // eslint-disable-next-line no-useless-constructor, max-params
  constructor(
    public id: string,
    public gameName: string,
    public category: gameCategory,
    public releaseDate: string,
    public img: string,
    public price: number,
    public description: string,
    public owner: User
  ) {}
}
