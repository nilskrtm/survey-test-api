module.exports = {
  root: true,
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  overrides: [
    /*
    {
      files: ['*.js'],
      parser: '@babel/eslint-parser',
      plugins: ['ft-flow'],
      rules: {
        // Flow Plugin
        // The following rules are made available via `eslint-plugin-ft-flow`

        'ft-flow/define-flow-type': 1,
        'ft-flow/use-flow-type': 1,
      },
    },
    */
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 1,
        'no-undef': 'off',
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': 1,
      },
    },
  ],
  rules: {},
};
