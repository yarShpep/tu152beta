// api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Абстрактная функция для создания методов CRUD
const createCRUDMethods = (resource) => ({
    getAll(params = {}) {
        return apiClient.get(`/${resource}`, { params });
    },
    getById(id) {
        return apiClient.get(`/${resource}/${id}`);
    },
    create(data) {
        return apiClient.post(`/${resource}`, data);
    },
    update(id, data) {
        return apiClient.put(`/${resource}/${id}`, data);
    },
    delete(id) {
        return apiClient.delete(`/${resource}/${id}`);
    },
});

// Создание методов для ресурса 'journals'
const journals = createCRUDMethods('journals');
// Создание методов для ресурса 'users'
const users = createCRUDMethods('users');
// Добавьте другие ресурсы по необходимости

export default {
    journals,
    users,
    // Другие ресурсы...
};