import User from '../domain/user.model.js';
import UserRepository from '../domain/user.model.repo';
import UserFinder from './userfinder';

const mockRepo = {
  find: jest.fn(),
} as unknown as UserRepository;

const pass = 'test1';

const mockUser = {
  id: '2',
  email: 'test',
  password: pass,
} as User;

describe('Given the UserCreator class', () => {
  const repo = new UserFinder(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserFinder);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create user repo method should called', async () => {
      (mockRepo.find as jest.Mock).mockResolvedValue(mockUser);

      await repo.execute('2');

      expect(mockRepo.find).toHaveBeenCalled();
    });
  });
});
