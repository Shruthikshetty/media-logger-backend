/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  testMatch: [
    '**/__tests__/**/*.test.ts', // Matches all .test.ts files inside any __test__ folder
    '**/__e2e__/**/*.test.ts', // Matches all .test.ts files inside any __e2e__ folder
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
