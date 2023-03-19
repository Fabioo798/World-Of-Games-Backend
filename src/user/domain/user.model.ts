import Game from '../../games/domain/game.model.js';

export default class User {
  // eslint-disable-next-line no-useless-constructor, max-params
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public shopList: Game[],
    public myGames: Game[],
    public img: string,
    public address: string,
    public notification: string[]
  ) {}
}
