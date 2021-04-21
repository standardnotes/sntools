module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'lib/**/{!(index),}.js'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules'
  ],
  coverageReporters: [
    'text',
    'html'
  ],
  testMatch: [
    '**/?(*.)(spec|test).js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
};
