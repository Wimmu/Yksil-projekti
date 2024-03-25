module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  // eslint-disable-next-line max-len
  'extends': ['google', 'eslint:recommended'], // if using WebStorm, omit plugin:prettier/recommended
  // Remove the first empty 'rules' object
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  // Remove the trailing comma after 'require-jsdoc': 0
  'rules': {
    'require-jsdoc': 0,
  },
};
