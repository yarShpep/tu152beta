// vue.config.js
module.exports = {
  devServer: {
    proxy: 'http://localhost:8080', // URL вашего Java-бэкенда
  },
};