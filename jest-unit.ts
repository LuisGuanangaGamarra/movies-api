import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],

  roots: ['<rootDir>/test/unit'],

  testMatch: ['**/*.spec.ts', '**/*.test.ts'],

  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: false,
        diagnostics: false,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/test/unit/setup.ts'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/dto(s)/**/*.ts',
    '!<rootDir>/src/**/*.schema.ts',
    '!<rootDir>/src/**/*.orm-entity.ts',
  ],
  forceCoverageMatch: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageDirectory: '<rootDir>/coverage/unit',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  clearMocks: true,
  resetMocks: true,

  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
};

export default config;
