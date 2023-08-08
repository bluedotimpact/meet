/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['eslint-config-domdomegg'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',

    // Based on airbnb-typescript, but with support for leading underscores
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'allow',
      },
    ],
  },
};
