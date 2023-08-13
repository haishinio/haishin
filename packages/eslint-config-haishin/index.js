module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['standard', 'turbo', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['standard-with-typescript', 'turbo', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
      },
      plugins: [
        '@typescript-eslint'
      ],
    }
  ],
};