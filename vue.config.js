module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Адрес вашего бэкенда
        changeOrigin: true, // Для корректной работы CORS
        pathRewrite: { '^/api': '' }, // Убирает /api из пути при отправке на бэкенд
      },
    },
  },
};