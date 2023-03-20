import { UserController } from '../../../application/controllers/user.controller.js';
import UserRouter from './user.router.js';

const mockController = {
  findUser: jest.fn(),
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
} as unknown as UserController;

describe('Given the userRouter class', () => {
  describe('When is instanced', () => {
    test('Then', () => {
      const router = new UserRouter(mockController);
      expect(router).toBeInstanceOf(UserRouter);
    });
  });
});
