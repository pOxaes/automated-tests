module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.feature$': 'gherkin-jest'
  },
  setupFiles: ['<rootDir>/support/index.js'],
  testMatch: ['<rootDir>/**/*.test.js', '<rootDir>/**/*.feature'],
  moduleFileExtensions: ['js', 'feature'],
  preset: 'jest-puppeteer-preset',
  setupTestFrameworkScriptFile: '<rootDir>/setup.js'
};
