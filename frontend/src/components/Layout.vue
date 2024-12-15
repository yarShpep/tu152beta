<template>
  <div>
    <nav>
      <!-- Ваши навигационные ссылки -->
      <router-link to="/">Главная</router-link>
      <router-link to="/add-entry">Добавить Запись</router-link>
      <!-- Добавьте другие ссылки по необходимости -->
    </nav>
    <main>
      <router-view></router-view> <!-- Вложенные маршруты будут рендериться здесь -->
    </main>
  </div>
</template>

<script>
export default {
  name: 'Layout',
};
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 10px;
}

nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

main {
  padding: 20px;
}
</style>