module.exports = {
  'parser': '@typescript-eslint/parser',
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 8,
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true,
    },
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint/eslint-plugin',
  ],
  'globals': {
    'module': 'readonly',
    'Pick': 'readonly',
    'Record': 'readonly',
    'ReturnType': 'readonly',
  },
  'rules': {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'linebreak-style': [
      'error',
      'windows',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
  },
}