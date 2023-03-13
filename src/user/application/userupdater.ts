import User from '../domain/user.js';
import UserRepository from '../domain/user.repo.js';

export default class UserUpdater {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: UserRepository) {}

  async execute(user: Partial<User>): Promise<void> {
    await this.repository.update(user);
  }
}
