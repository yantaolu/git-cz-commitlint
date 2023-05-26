module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-empty-function': 1,
  },
};
