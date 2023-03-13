import Game from '../../games/domain/game.js';

export default class User {
  // eslint-disable-next-line no-useless-constructor, max-params
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public shoplist: Game[],
    public mygames: Game[],
    public img: string,
    public address: string,
    public notification: string[]
  ) {}
}
