// // src/store/index.js
import api from '@/services/api.js';

export default {
    state: {
        journals: [],
        currentJournal: {},
    },
    mutations: {
        SET_JOURNALS(state, journals) {
            state.journals = journals;
        },
        SET_CURRENT_JOURNAL(state, journal) {
            state.currentJournal = journal;
        },
    },
    actions: {
        async fetchJournals({ commit }) {
            const response = await api.getJournals();
            commit('SET_JOURNALS', response.data);
        },
        async fetchJournalById({ commit }, id) {
            const response = await api.getJournalById(id);
            commit('SET_CURRENT_JOURNAL', response.data);
        },
        async saveJournal({ dispatch }, journal) {
            await api.saveJournal(journal);
            dispatch('fetchJournals'); // Обновить список после добавления
        },
        async updateJournal({ dispatch }, { id, journal }) {
            await api.updateJournal(id, journal);
            dispatch('fetchJournals'); // Обновить список после изменения
        },
        async deleteJournal({ dispatch }, id) {
            await api.deleteJournal(id);
            dispatch('fetchJournals'); // Обновить список после удаления
        },
    },
};
// import { createStore } from 'vuex';
// import { v4 as uuidv4 } from 'uuid';
//
// function loadState() {
//     try {
//         const serializedState = localStorage.getItem('vuex-state');
//         if (serializedState === null) {
//             return {
//                 entries: [],
//                 currentEntry: {},
//             };
//         }
//         return JSON.parse(serializedState);
//     } catch (e) {
//         console.warn('Не удалось загрузить состояние из localStorage:', e);
//         return {
//             entries: [],
//             currentEntry: {},
//         };
//     }
// }
//
// function saveState(state) {
//     try {
//         const serializedState = JSON.stringify(state);
//         localStorage.setItem('vuex-state', serializedState);
//     } catch (e) {
//         console.warn('Не удалось сохранить состояние в localStorage:', e);
//     }
// }
//
// export default createStore({
//     state: loadState(),
//     mutations: {
//         ADD_ENTRY(state, entry) {
//             state.entries.unshift(entry); // Добавляем новую запись в начало массива
//             console.log('Entry added:', entry);
//         },
//         UPDATE_CURRENT_ENTRY(state, data) {
//             state.currentEntry = { ...state.currentEntry, ...data };
//             console.log('Current entry updated:', state.currentEntry);
//         },
//         RESET_CURRENT_ENTRY(state) {
//             state.currentEntry = {};
//             console.log('Current entry reset');
//         },
//         // Другие мутации, если есть
//     },
//     actions: {
//         addEntry({ commit, state }) {
//             const newEntry = {
//                 id: uuidv4(), // Генерируем уникальный идентификатор
//                 createdAt: new Date().toISOString(), // Добавляем поле даты создания
//                 ...state.currentEntry,
//             };
//             commit('ADD_ENTRY', newEntry);
//             commit('RESET_CURRENT_ENTRY');
//         },
//         // Другие действия, если есть
//     },
//     getters: {
//         // Ваши геттеры, если есть
//     },
//     plugins: [
//         (store) => {
//             store.subscribe((mutation, state) => {
//                 saveState(state);
//             });
//         },
//     ],
// });