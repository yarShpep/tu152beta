<!-- src/components/AddEntry.vue -->
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
      { id: '1', name: 'Дата, время, станция смены локомотивной бригады' },
      { id: '2.1', name: 'Фамилия машиниста Прибывшего' },
      { id: '2.2', name: 'Фамилия машиниста Отправляющегося' },
      // Добавьте остальные столбцы
    ];

    const isColumnFilled = (columnId) => {
      return store.state.currentEntry[columnId] !== undefined;
    };

    const allColumnsFilled = computed(() => {
      return columns.every((column) => isColumnFilled(column.id));
    });

    const saveEntry = () => {
      store.dispatch('addEntry');
      router.push('/');
    };

    const cancel = () => {
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

<style>
.add-entry {
  padding: 20px;
}
</style>