// src/store/index.js
import { createStore } from 'vuex';
import api from '../services/api.js';

export default createStore({
    state: {
        entries: [], // Массив всех записей
        currentEntry: {}, // Текущая выбранная запись
        error: null, // Сообщение об ошибке
    },
    mutations: {
        // Устанавливает массив записей
        SET_ENTRIES(state, entries) {
            state.entries = entries;
        },
        // Добавляет новую запись в начало массива
        ADD_ENTRY(state, entry) {
            state.entries.unshift(entry);
        },
        // Обновляет существующую запись
        UPDATE_ENTRY(state, updatedEntry) {
            const index = state.entries.findIndex(entry => entry.id === updatedEntry.id);
            if (index !== -1) {
                Object.assign(state.entries[index], updatedEntry);
            }
        },
        // Удаляет запись по ID
        REMOVE_ENTRY(state, id) {
            state.entries = state.entries.filter(entry => entry.id !== id);
        },
        // Обновляет текущую запись с дополнительными данными
        UPDATE_CURRENT_ENTRY(state, data) {
            state.currentEntry = { ...state.currentEntry, ...data };
        },
        // Сбрасывает текущую запись
        RESET_CURRENT_ENTRY(state) {
            state.currentEntry = {};
        },
        // Устанавливает сообщение об ошибке
        SET_ERROR(state, error) {
            state.error = error;
        },
        // Очищает сообщение об ошибке
        CLEAR_ERROR(state) {
            state.error = null;
        },
        // Устанавливает текущую запись
        SET_CURRENT_ENTRY(state, entry) {
            state.currentEntry = entry;
        },
    },
    actions: {
        // Получает все записи с API
        async fetchEntries({ commit }) {
            try {
                const response = await api.getJournals();
                commit('SET_ENTRIES', response.data);
                commit('CLEAR_ERROR'); // Очищает ошибку после успешного запроса
            } catch (error) {
                console.error('Ошибка при получении записей:', error);
                commit('SET_ERROR', 'Не удалось загрузить записи. Попробуйте позже.');
            }
        },
        // Добавляет новую запись через API
        async addEntry({ commit }, entryData) {
            try {
                const response = await api.createJournal(entryData);
                commit('ADD_ENTRY', response.data);
                commit('RESET_CURRENT_ENTRY'); // Сбрасывает текущую запись после добавления
                commit('CLEAR_ERROR');
            } catch (error) {
                console.error('Ошибка при добавлении записи:', error);
                commit('SET_ERROR', 'Не удалось добавить запись. Проверьте введённые данные и попробуйте снова.');
            }
        },
        // Обновляет существующую запись через API
        async updateEntry({ commit }, updatedEntry) {
            try {
                const response = await api.updateJournal(updatedEntry.id, updatedEntry);
                commit('UPDATE_ENTRY', response.data);
                commit('CLEAR_ERROR');
            } catch (error) {
                console.error('Ошибка при обновлении записи:', error);
                commit('SET_ERROR', 'Не удалось обновить запись. Проверьте введённые данные и попробуйте снова.');
            }
        },
        // Удаляет запись по ID через API
        async deleteEntry({ commit }, id) {
            try {
                await api.deleteJournal(id);
                commit('REMOVE_ENTRY', id);
                commit('CLEAR_ERROR');
            } catch (error) {
                console.error('Ошибка при удалении записи:', error);
                commit('SET_ERROR', 'Не удалось удалить запись. Попробуйте позже.');
            }
        },
        // Устанавливает текущую запись
        setCurrentEntry({ commit }, entry) {
            commit('SET_CURRENT_ENTRY', entry);
        },
        // Другие действия, если есть
    },
    getters: {
        // Возвращает все записи
        allEntries: state => state.entries,
        // Возвращает запись по ID
        getEntryById: state => id => state.entries.find(entry => entry.id === id),
        // Возвращает сообщение об ошибке
        error: state => state.error,
        // Возвращает текущую запись
        currentEntry: state => state.currentEntry,
        // Другие геттеры, если есть
    },
});