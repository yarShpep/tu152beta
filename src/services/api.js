import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1', // Базовый URL, на основе вашего бэкенда
});

export default {
    getJournals() {
        return api.get('/journal'); // Получить все записи
    },
    getJournalById(id) {
        return api.get(`/journal/${id}`); // Получить запись по ID
    },
    saveJournal(journal) {
        return api.post('/journal', journal); // Добавить новую запись
    },
    updateJournal(id, journal) {
        return api.put(`/journal/${id}`, journal); // Обновить запись
    },
    deleteJournal(id) {
        return api.post(`/journal/${id}`); // Удалить запись
    },
};