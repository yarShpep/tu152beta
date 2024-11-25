// src/store/index.js
import { createStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

function loadState() {
    try {
        const serializedState = localStorage.getItem('vuex-state');
        if (serializedState === null) {
            return {
                entries: [],
                currentEntry: {},
            };
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn('Не удалось загрузить состояние из localStorage:', e);
        return {
            entries: [],
            currentEntry: {},
        };
    }
}

function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('vuex-state', serializedState);
    } catch (e) {
        console.warn('Не удалось сохранить состояние в localStorage:', e);
    }
}

export default createStore({
    state: loadState(),
    mutations: {
        ADD_ENTRY(state, entry) {
            const entryWithId = { id: uuidv4(), ...entry };
            state.entries.push(entryWithId);
            console.log('Entry added:', entryWithId);
        },
        UPDATE_CURRENT_ENTRY(state, data) {
            state.currentEntry = { ...state.currentEntry, ...data };
            console.log('Current entry updated:', state.currentEntry);
        },
        RESET_CURRENT_ENTRY(state) {
            state.currentEntry = {};
            console.log('Current entry reset');
        },
        // Другие мутации
    },
    actions: {
        addEntry({ commit, state }) {
            commit('ADD_ENTRY', state.currentEntry);
            commit('RESET_CURRENT_ENTRY');
            console.log('Entry added via action:', state.currentEntry);
        },
        // Другие действия
    },
    getters: {
        // Ваши геттеры
    },
    plugins: [
        (store) => {
            store.subscribe((mutation, state) => {
                saveState(state);
            });
        },
    ],
});