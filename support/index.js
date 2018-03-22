const { cucumber } = require('gherkin-jest');
const puppeteer = require('puppeteer');

cucumber.defineCreateWorld(() => ({
  browser: undefined,
  page: undefined
}));

cucumber.defineRule('I am on google.com', async world => {
  world.browser = await puppeteer.launch(global.browserConfig);
  world.page = await world.browser.newPage();
  await world.page.goto('https://google.com', {
    waitUntil: ['networkidle0', 'load', 'domcontentloaded']
  });
  expect(world.page).toMatch('Google');
});

cucumber.defineRule('I search for {string}', async (world, searchString) => {
  const navPromise = world.page.waitForNavigation();
  await expect(world.page).toFill('input.gsfi', searchString);
  await expect(world.page).toClick("input[type='submit']");
  await navPromise;
});

cucumber.defineRule(
  'I can see {string} in the results',
  async (world, resultString) => {
    await expect(world.page).toMatchElement('a', { text: resultString });
  }
);
