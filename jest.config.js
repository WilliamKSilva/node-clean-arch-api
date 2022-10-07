module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-node",
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
};
