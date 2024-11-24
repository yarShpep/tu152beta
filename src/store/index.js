// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        entries: [],
        currentEntry: {},
    },
    mutations: {
        ADD_ENTRY(state, entry) {
            state.entries.push(entry);
        },
        UPDATE_CURRENT_ENTRY(state, data) {
            state.currentEntry = { ...state.currentEntry, ...data };
        },
        RESET_CURRENT_ENTRY(state) {
            state.currentEntry = {};
        },
    },
    actions: {
        addEntry({ commit, state }) {
            commit('ADD_ENTRY', state.currentEntry);
            commit('RESET_CURRENT_ENTRY');
        },
    },
});