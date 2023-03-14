/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'schema',
    'router',
    'error.ts',
    'db.connect',
    'config',
    'model',
    'schema.ts',
    'user.ts',
    'game.ts',
  ],
};
