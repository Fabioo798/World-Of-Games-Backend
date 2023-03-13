import User from '../domain/user.js';
import UserRepository from '../domain/user.repo.js';

export default class UserFinder {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    // eslint-disable-next-line no-return-await
    return await this.repository.find(id);
  }
}
