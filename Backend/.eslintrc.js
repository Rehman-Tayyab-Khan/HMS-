module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-unreachable': 'warn',
    'no-duplicate-case': 'error',
    'no-empty': 'warn',
    'no-extra-semi': 'warn',
    'no-irregular-whitespace': 'warn',
    'no-unused-labels': 'warn',
    'prefer-const': 'warn',
    'no-var': 'warn'
  },
  ignorePatterns: ['node_modules/', 'logs/', 'dist/', '*.min.js']
};
