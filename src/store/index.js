import { createStore } from 'vuex';

// Функция для загрузки состояния из localStorage
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

// Функция для сохранения состояния в localStorage
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
            state.entries.push(entry);
            console.log('Entry added:', entry);
        },
        UPDATE_CURRENT_ENTRY(state, data) {
            state.currentEntry = { ...state.currentEntry, ...data };
            console.log('Current entry updated:', state.currentEntry);
        },
        RESET_CURRENT_ENTRY(state) {
            state.currentEntry = {};
            console.log('Current entry reset');
        },
    },
    actions: {
        addEntry({ commit, state }) {
            commit('ADD_ENTRY', state.currentEntry);
            commit('RESET_CURRENT_ENTRY');
            // Здесь можно добавить вызов к бэкенду через Axios
            console.log('Entry added via action:', state.currentEntry);
        },
    },
    getters: {
        // Удалите или оставьте, если вы планируете использовать
        getEmployeeById: (state) => (id) => {
            return state.employees.find((emp) => emp.id === id);
        },
    },
    plugins: [
        store => {
            store.subscribe((mutation, state) => {
                saveState(state);
            });
        },
    ],
});