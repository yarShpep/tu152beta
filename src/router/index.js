// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import AddEntry from '@/components/AddEntry.vue';
import ColumnForm from '@/components/ColumnForm.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/add-entry', component: AddEntry },
    { path: '/add-entry/column/:id', component: ColumnForm, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;