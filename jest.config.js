module.exports = {
    // Your existing Jest configuration options
    moduleNameMapper: {
      '^views/(.*)$': '<rootDir>/src/views/$1',
      '^shared/(.*)$': '<rootDir>/src/shared/$1',
      '^constants/(.*)$': '<rootDir>/src/constants/$1',
      // Add more mappings as needed
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Mock CSS modules
      '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js', // Mock files like images
    },
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!@edx/frontend-platform|@edx/paragon|react-paragon-topaz)'],
    testEnvironment: 'jest-environment-jsdom',
  };
