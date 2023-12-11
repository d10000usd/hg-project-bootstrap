/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint: ["eslint:recommended", "node"]',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
