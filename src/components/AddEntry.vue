<!-- src/components/AddEntry.vue -->
<template>
  <div class="add-entry">
    <h1>Добавить новую запись</h1>
    <ul class="column-list">
      <li v-for="column in columns" :key="column.id" class="column-item">
        <router-link :to="`/add-entry/column/${column.id}`" class="column-link">
          {{ column.name }}
          <span v-if="isColumnFilled(column.id)" class="checkmark">✔️</span>
        </router-link>
      </li>
    </ul>
    <div class="button-group">
      <button
          :class="['btn', allColumnsFilled ? 'btn-success' : 'btn-disabled']"
          :disabled="!allColumnsFilled"
          @click="saveEntry"
      >
        Сохранить
      </button>
      <button class="btn btn-secondary" @click="cancel">Отменить</button>
    </div>
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
      { id: '1', name: 'Дата, время, станция смены' },
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
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-entry h1 {
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
}

.column-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
}

.column-item {
  margin-bottom: 15px;
}

.column-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--light-color);
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.3s ease;
}

.column-link:hover {
  background-color: var(--primary-color-hover);
  color: #ffffff;
}

.checkmark {
  font-size: 20px;
  color: var(--success-color);
}

.button-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.button-group button {
  margin-right: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Стили для активной кнопки "Сохранить" */
.btn-success {
  background-color: var(--success-color);
  color: #ffffff;
}

.btn-success:hover {
  background-color: var(--success-color-hover);
}

/* Стили для неактивной кнопки "Сохранить" */
.btn-disabled {
  background-color: #6c757d; /* Тёмно-серый цвет */
  color: #ffffff;
  border: 2px solid #6c757d;
  cursor: not-allowed;
}

.btn-disabled:hover {
  background-color: #6c757d; /* Цвет не меняется при наведении */
}

/* Стили для кнопки "Отменить" */
.btn-secondary {
  background-color: var(--secondary-color);
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: var(--secondary-color-hover);
}
</style>