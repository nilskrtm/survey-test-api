module.exports = {
  root: true,
  env: {
    es2021: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {},
    },
    /* for react
    {
      files: ['*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['react', '@typescript-eslint/eslint-plugin'],
      ecmaFeatures: {
        jsx: true,
      },
      rules: {},
    },
     */
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-shadow': 1,
    'no-undef': 'off',
    '@typescript-eslint/func-call-spacing': 1,
    'object-curly-spacing': ['error', 'always'],
  },
};
