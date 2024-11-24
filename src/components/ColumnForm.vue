<!-- src/components/ColumnForm.vue -->
<template>
  <div class="column-form" v-if="column">
    <h2>{{ column.name }}</h2>
    <form @submit.prevent="saveColumnData">
      <div v-for="field in column.fields" :key="field" class="form-group">
        <label :for="field">{{ field }}</label>
        <input
            v-model="formData[field]"
            :id="field"
            required
            :type="getFieldType(field)"
        />
      </div>
      <button class="btn-primary" type="submit" :disabled="!formValid">
        Сохранить
      </button>
      <button class="btn-secondary" @click="cancel">Отменить</button>
    </form>
  </div>
  <div v-else>
    <p>Колонка не найдена.</p>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'ColumnForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const columns = [
      {
        id: '1',
        name: 'Дата, время, станция смены локомотивной бригады',
        fields: ['Дата', 'Время (часы, минуты)', 'Станция'],
      },
      {
        id: '2.1',
        name: 'Фамилия машиниста Прибывшего',
        fields: ['Фамилия машиниста', 'Фамилия помощника машиниста (опционально)'],
      },
      {
        id: '2.2',
        name: 'Фамилия машиниста Отправляющегося',
        fields: ['Фамилия машиниста', 'Фамилия помощника машиниста (опционально)'],
      },
      // Добавьте остальные столбцы
    ];

    const column = computed(() => {
      return columns.find((col) => col.id === route.params.id);
    });

    if (!column.value) {
      router.push('/add-entry');
    }

    const formData = reactive({});

    const formValid = computed(() => {
      return Object.keys(formData).length === column.value.fields.length;
    });

    const getFieldType = (field) => {
      if (field.includes('Дата')) return 'date';
      if (field.includes('Время')) return 'time';
      if (field.includes('№')) return 'number';
      return 'text';
    };

    const saveColumnData = () => {
      store.commit('UPDATE_CURRENT_ENTRY', { [column.value.id]: { ...formData } });
      router.push('/add-entry');
    };

    const cancel = () => {
      router.push('/add-entry');
    };

    return {
      column,
      formData,
      formValid,
      getFieldType,
      saveColumnData,
      cancel,
    };
  },
};
</script>

<style>
.column-form {
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
</style>