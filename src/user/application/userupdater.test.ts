import User from '../domain/user.js';
import UserRepository from '../domain/user.repo.js';
import UserUpdater from './userupdater.js';

const mockRepo = {
  update: jest.fn(),
} as unknown as UserRepository;

const mockUser = {
  id: '2',
  email: 'test',
  password: 'test1',
} as User;

describe('Given the UserUpdater class', () => {
  const repo = new UserUpdater(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserUpdater);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the search user repo method should called', async () => {
      (mockRepo.update as jest.Mock).mockResolvedValue(mockUser);

      await repo.execute(mockUser);

      expect(mockRepo.update).toHaveBeenCalled();
    });
  });
});
