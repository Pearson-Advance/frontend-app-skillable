module.exports = {
    moduleNameMapper: {
      '^views/(.*)$': '<rootDir>/src/views/$1',
      '^xtremeLabsViews/(.*)$': '<rootDir>/src/xtreme-labs-views/$1',
      "^common/(.*)$": "<rootDir>/src/common/$1",
      '^shared/(.*)$': '<rootDir>/src/shared/$1',
      '^constants/(.*)$': '<rootDir>/src/constants/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!@edx/frontend-platform|@edx/paragon|react-paragon-topaz)'],
    testEnvironment: 'jest-environment-jsdom',
    testTimeout: 10000,
  };
