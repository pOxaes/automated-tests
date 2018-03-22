process.on('unhandledRejection', err => {
  throw err;
});

const jest = require('jest');

const argv = process.argv.slice(2);

jest.run(argv);
