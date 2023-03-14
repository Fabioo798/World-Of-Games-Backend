import User from '../domain/user.model.js';
import UserRepository from '../domain/user.model.repo';
import UserSearcher from './usersearcher';

const mockRepo = {
  search: jest.fn(),
} as unknown as UserRepository;

const mockUser = {
  id: '2',
  email: 'test',
  password: 'test1',
} as User;

describe('Given the UserSearcher class', () => {
  const repo = new UserSearcher(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserSearcher);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the search user repo method should called', async () => {
      (mockRepo.search as jest.Mock).mockResolvedValue(mockUser);

      await repo.execute({ key: 'email', value: 'test' });

      expect(mockRepo.search).toHaveBeenCalled();
    });
  });
});
