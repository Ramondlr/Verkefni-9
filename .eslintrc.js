module.exports = {
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  rules: {
    'no-console': ['error', {
      allow: ['info', 'warn', 'error'],
    }],
    'no-use-before-define': ['error', {
       functions: true, classes: true }],
  },
};