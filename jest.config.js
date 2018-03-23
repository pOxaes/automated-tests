module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.feature$': 'gherkin-jest'
  },
  setupFiles: ['<rootDir>/support/slack.js'],
  testMatch: ['<rootDir>/features/slack.feature'],
  moduleFileExtensions: ['js', 'feature'],
  preset: 'jest-puppeteer-preset',
  setupTestFrameworkScriptFile: '<rootDir>/setup.js'
};
