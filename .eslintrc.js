// .eslintrc.js
module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential', // Используем конфигурацию для Vue 3
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        // Ваши пользовательские правила
        'vue/multi-word-component-names': 'off',
    },
};