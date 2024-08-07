import User from '../domain/user.model.js';
import UserRepository from '../domain/user.model.repo';
import UserCreator from './usercreator';

const mockRepo = {
  create: jest.fn(),
} as unknown as UserRepository;

const pass = 'test1'

const mockUser = {
  id: '2',
  email: 'test',
  password: pass,
} as User;

describe('Given the UserCreator class', () => {
  const repo = new UserCreator(mockRepo);

  describe('when is it called', () => {
    test('Then it should be instantiated', () => {
      expect(repo).toBeInstanceOf(UserCreator);
    });
  });

  describe('When the method execute is called', () => {
    test('Then the create user repo method should called', async () => {
      (mockRepo.create as jest.Mock).mockResolvedValue(mockUser);

      await repo.execute(mockUser);

      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});
