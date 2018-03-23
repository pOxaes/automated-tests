const { cucumber } = require('gherkin-jest');
const puppeteer = require('puppeteer');

cucumber.defineCreateWorld(() => ({
  browser: undefined,
  page: undefined,
  user: {
    email: undefined,
    password: undefined
  }
}));

cucumber.defineRule(
  "Je suis connecté à l'espace de travail {string} en tant que {string} avec le mot de passe {string}",
  async (world, workspace, email, password) => {
    world.browser = await puppeteer.launch(global.browserConfig);
    world.page = await world.browser.newPage();
    await world.page.goto(`https://${workspace}.slack.com`, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded']
    });
    await expect(world.page).toFillForm('form#signin_form', {
      email,
      password
    });
    await expect(world.page).toClick('button[type=submit]', {
      text: 'Sign in'
    });
    await world.page.waitForNavigation({
      waitUntil: ['networkidle2', 'load', 'domcontentloaded']
    });
  }
);

cucumber.defineRule('Je devrais être dans un channel', async world => {
  await expect(world.page).toMatchElement('button#channel_title');
});

cucumber.defineRule('Je dois pouvoir fermer mon navigateur', async world => {
  await world.browser.close();
});

cucumber.defineRule(
  'Je suis sur la chaîne {string}',
  async (world, channelName) => {
    const currentChannel = await world.page.$eval(
      'button#channel_title',
      el => el.innerText
    );
    if (currentChannel === `#${channelName}`) {
      return;
    }
    const currentUrl = await world.page.evaluate(() => window.location.href);
    await expect(world.page).toClick('a.p-channel_sidebar__channel', {
      text: channelName
    });
    await world.page.waitForFunction(
      `window.location.href !== "${currentUrl}"`
    );
    await expect(world.page).toMatchElement('button#channel_title', {
      text: channelName
    });
  }
);

cucumber.defineRule("J'envoie le message {string}", async (world, message) => {
  await expect(world.page).toFill('#msg_input .ql-editor', message);
  await world.page.keyboard.press('Enter');
});

cucumber.defineRule(
  'Je dois recevoir le message {string}',
  async (world, message) => {
    await expect(world.page).toMatchElement('.c-message__body', {
      text: message,
      polling: 'mutation'
    });
  }
);

cucumber.defineRule(
  "J'ai envoyé le message {string}",
  async (world, message) => {
    await expect(world.page).toFill('#msg_input .ql-editor', message);
    await world.page.keyboard.press('Enter');
    await expect(world.page).toMatchElement('.c-message__body', {
      text: message,
      polling: 'mutation',
      timeout: 500
    });
  }
);

cucumber.defineRule(
  'Je supprime le message {string}',
  async (world, message) => {
    const matchingMessage = await world.page.evaluateHandle(searchedMessage => {
      const messages = document.querySelectorAll('.c-message__body');
      return Array.prototype.slice
        .call(messages)
        .find(el => el.innerText === searchedMessage);
    }, message);
    const elPos = await matchingMessage.boundingBox();
    await world.page.mouse.move(elPos.x, elPos.y);
    await world.page.waitFor(
      '.c-message__actions button[aria-label="Autres actions"]'
    );
    await expect(world.page).toClick(
      '.c-message__actions button[aria-label="Autres actions"]'
    );
    await world.page.waitFor(
      '.popover .c-menu button[data-qa="delete_message"]'
    );
    await expect(world.page).toClick('button', {
      text: 'Supprimer le message'
    });
    await world.page.waitFor('.modal button.dialog_go');
    await expect(world.page).toClick('.modal button', {
      text: 'Supprimer'
    });
    // no time anymore, let's do it dirty:
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
);

cucumber.defineRule(
  'Je ne vois pas le message {string}',
  async (world, message) => {
    const matchingMessageCount = await world.page.evaluate(searchedMessage => {
      const messages = document.querySelectorAll('.c-message__body');
      return Array.prototype.slice
        .call(messages)
        .filter(el => el.innerText === searchedMessage).length;
    }, message);
    expect(matchingMessageCount).toBe(0);
  }
);
