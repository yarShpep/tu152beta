// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('@/components/HomePage.vue');
const AddEntry = () => import('@/components/AddEntry.vue');
const ColumnForm = () => import('@/components/ColumnForm.vue');
const ViewEntry = () => import('@/components/ViewEntry.vue');
const NotFound = () => import('@/components/NotFound.vue');
const AppLayout = () => import('@/components/AppLayout.vue'); // Обновленный импорт

const routes = [
    {
        path: '/',
        component: AppLayout, // Использование нового имени компонента
        children: [
            {
                path: '',
                component: HomePage,
                meta: { title: 'Главная Страница' },
            },
            {
                path: 'add-entry',
                component: AddEntry,
                meta: { requiresAuth: true, title: 'Добавить Запись' },
            },
            {
                path: 'add-entry/column/:id',
                component: ColumnForm,
                props: true,
                meta: { requiresAuth: true, title: 'Форма Колонки' },
            },
            {
                path: 'view-entry/:id',
                component: ViewEntry,
                props: true,
                meta: { requiresAuth: true, title: 'Просмотр Записи' },
            },
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;