<template>
  <div class="add-entry">
    <h2>Добавить новую запись</h2>
    <ul>
      <li v-for="column in columns" :key="column.id">
        <router-link :to="`/add-entry/column/${column.id}`">
          {{ column.name }}
          <span v-if="isColumnFilled(column.id)">✔️</span>
        </router-link>
      </li>
    </ul>
    <button
        class="btn-primary"
        :disabled="!allColumnsFilled"
        @click="saveEntry"
    >
      Сохранить
    </button>
    <button class="btn-secondary" @click="cancel">Отменить</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'AddEntry',
  setup() {
    const store = useStore();
    const router = useRouter();

    const columns = [
      { id: '1', name: 'Дата, время (час, мин.), станция смены локомотивной бригады' },
      { id: '2', name: 'Фамилия машиниста' },
      { id: '3', name: 'Наличие топлива в момент приемки' },
      { id: '4', name: 'Замечания и неисправности' },
      { id: '5', name: 'Дата устранения неисправности' },
      // Добавьте остальные столбцы, если необходимо
    ];

    const isColumnFilled = (columnId) => {
      return store.state.currentEntry[columnId] !== undefined;
    };

    const allColumnsFilled = computed(() => {
      return columns.every((column) => isColumnFilled(column.id));
    });

    const saveEntry = () => {
      console.log('Кнопка "Сохранить" на странице AddEntry нажата');
      store.dispatch('addEntry');
      router.push('/');
    };

    const cancel = () => {
      console.log('Кнопка "Отменить" на странице AddEntry нажата');
      store.commit('RESET_CURRENT_ENTRY');
      router.push('/');
    };

    return {
      columns,
      isColumnFilled,
      allColumnsFilled,
      saveEntry,
      cancel,
    };
  },
};
</script>

<style scoped>
.add-entry {
  padding: 20px;
}
.add-entry ul {
  list-style-type: none;
  padding: 0;
}
.add-entry li {
  margin-bottom: 10px;
}
</style>