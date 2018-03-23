const expectPuppeteer = require('expect-puppeteer');

jasmine.DEFAULT_TIMEOUT_INTERVAL = process.env.TIMEOUT_INTERVAL
  ? parseInt(process.env.TIMEOUT_INTERVAL, 10)
  : 25000;

global.browserConfig = { headless: process.env.HEADLESS !== 'false' };

module.exports = expectPuppeteer;
