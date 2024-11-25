// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import AddEntry from '@/components/AddEntry.vue';
import ColumnForm from '@/components/ColumnForm.vue';
import ViewEntry from '@/components/ViewEntry.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/add-entry', component: AddEntry },
    { path: '/add-entry/column/:id', component: ColumnForm, props: true },
    { path: '/view-entry/:id', component: ViewEntry, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;