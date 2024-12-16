// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/global.css';
import api from './services/api'; // Подключаем API сервис

// Тестовый вызов к бэкенду перед монтированием приложения
api.getJournals()
    .then(response => {
        console.log('Успешное подключение к бэкенду! Данные:', response.data);
    })
    .catch(error => {
        console.error('Ошибка при подключении к бэкенду:', error.message);
    });

createApp(App)
    .use(router)
    .use(store)
    .mount('#app');