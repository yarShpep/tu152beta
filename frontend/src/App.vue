<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Предотвращаем горизонтальную прокрутку */
}

#app {
  max-width: 100%;
}
</style>