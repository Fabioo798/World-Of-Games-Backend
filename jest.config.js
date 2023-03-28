/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'node_modules'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'schema',
    'error.ts',
    'config',
    'model',
    'schema.ts',
    'user.ts',
    'game.ts',
    'express.server.ts',
  ],
};
