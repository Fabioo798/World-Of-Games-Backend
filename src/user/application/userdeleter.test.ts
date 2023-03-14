import User from '../domain/user.model.js';
import UserRepository from '../domain/user.model.repo.js';
import UserDeleter from './userdeleter.js';

const mockRepo = {
  delete: jest.fn(),
} as unknown as UserRepository;

const pass = 'test1';

const mockUser = {
  id: '2',
  email: 'test',
  password: pass,
} as User;

describe('Given the UserDeleter class', () => {
  const repo = new UserDeleter(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserDeleter);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create user repo method should called', async () => {
      (mockRepo.delete as jest.Mock).mockResolvedValue(mockUser);

      await repo.execute('2');

      expect(mockRepo.delete).toHaveBeenCalled();
    });
  });
});
