module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    es6: true,
    jest: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'cucumber'],
  globals: {
    window: true,
    jasmine: true,
    document: true
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'no-param-reassign': 0
  }
};
