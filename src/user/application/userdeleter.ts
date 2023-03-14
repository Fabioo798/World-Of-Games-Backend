import UserRepository from '../domain/user.model.repo.js';

export default class UserDeleter {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repository: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
