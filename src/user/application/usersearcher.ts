import User from '../domain/user.model.js';
import UserRepository from '../domain/user.model.repo.js';

export default class UserSearcher {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: UserRepository) {}

  async execute(query: { key: string; value: unknown }): Promise<User[]> {
    const response = await this.repository.search(query);
    return response;
  }
}
