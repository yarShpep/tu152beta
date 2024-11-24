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
        parser: '@babel/eslint-parser',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        'vue/multi-word-component-names': 'off', // Отключаем правило, если необходимо
        'no-undef': 'off' // Отключаем, если используем глобальные переменные или другие методы
        // Добавьте другие правила по необходимости
    },
};