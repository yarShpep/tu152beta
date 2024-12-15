<!-- src/components/ViewEntry.vue -->
<template>
  <div class="view-entry">
    <button class="btn-secondary" @click="goBack">&lt; Назад</button>
    <h2>Просмотр записи</h2>

    <div v-if="isLoading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="filteredEntry">
      <!-- Используем filteredEntry для отображения -->
      <div
          v-for="(columnData, columnId) in filteredEntry"
          :key="`column-${columnId}`"
      >
        <h3>{{ getColumnName(columnId) }}</h3>
        <div
            v-for="(value, key) in columnData"
            :key="`field-${columnId}-${key}`"
        >
          <strong>{{ getFieldLabel(columnId, key) }}:</strong>
          {{ formatValue(value, key) }}
        </div>
      </div>
    </div>

    <div v-else>
      <p>Запись не найдена.</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ViewEntry',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const entryId = route.params.id;

    const isLoading = ref(false);
    const error = ref(null);

    const entry = computed(() =>
        store.state.entries.find((e) => e.id === entryId)
    );

    const columns = [
      {
        id: '1',
        name: 'Дата, время (час, мин.), станция смены локомотивной бригады',
        fields: [
          { name: 'date', label: 'Дата' },
          { name: 'direction', label: 'Направление' },
          { name: 'train', label: 'Поезд' },
          { name: 'weight', label: 'Вес (кг)' },
          { name: 'axles', label: 'Оси' },
          { name: 'acceptanceTime', label: 'Время (Начало приемки)' },
        ],
      },
      {
        id: '2',
        name: 'Фамилия машиниста',
        subcolumns: [
          {
            id: '2.1',
            name: 'Прибывающего (сдающего)',
            fields: [
              { name: 'arrivalDriver', label: 'ФИО Машиниста Прибывающего' },
              { name: 'arrivalAssistant', label: 'ФИО Помощника Прибывающего' },
              { name: 'arrivalTime', label: 'Сдал (Время сдачи)' },
            ],
          },
          {
            id: '2.2',
            name: 'Отправляющегося (принимающего)',
            fields: [
              { name: 'departureDriver', label: 'ФИО Машиниста Отправляющего' },
              { name: 'departureAssistant', label: 'ФИО Помощника Отправляющего' },
              { name: 'departureTime', label: 'Принял (Время приема)' },
            ],
          },
        ],
      },
      {
        id: '3',
        name: 'Наличие топлива в момент приемки',
        fields: [
          { name: 'fuelOption', label: 'Опция' },
          { name: 'fuelAmount', label: 'Количество топлива (кг)' },
          { name: 'electricityReading', label: 'Показание счетчика электроэнергии' },
        ],
      },
      {
        id: '4',
        name: 'Замечания и неисправности',
        fields: [
          { name: 'comments', label: 'Замечания и неисправности' },
          { name: 'signatureGiven', label: 'Подпись сдающего машиниста' },
          { name: 'signatureReceived', label: 'Подпись принимающего машиниста' },
        ],
      },
      // Убираем столбец с id '5' (6-й столбец)
    ];

    const allowedColumnIds = columns.map((col) => col.id);

    const filteredEntry = computed(() => {
      if (!entry.value) return null;

      const newEntry = {};

      allowedColumnIds.forEach((columnId) => {
        if (entry.value[columnId]) {
          newEntry[columnId] = entry.value[columnId];
        }
      });

      return newEntry;
    });

    const getColumnName = (columnId) => {
      const column = columns.find((col) => col.id === columnId);
      return column ? column.name : 'Неизвестный столбец';
    };

    const getFieldLabel = (columnId, fieldName) => {
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        if (column.fields) {
          const field = column.fields.find((f) => f.name === fieldName);
          if (field) return field.label;
        }
        if (column.subcolumns) {
          for (const subcol of column.subcolumns) {
            const field = subcol.fields.find((f) => f.name === fieldName);
            if (field) return field.label;
          }
        }
      }
      return fieldName;
    };

    const formatValue = (value, key) => {
      if (typeof value === 'boolean') {
        return value ? 'Да' : 'Нет';
      }
      if (key === 'fuelOption') {
        return value === 'fuel'
            ? 'Наличие топлива в момент приемки'
            : 'Показание счетчика электроэнергии в момент приемки';
      }
      return value ? value : '-';
    };

    const goBack = () => {
      router.push('/');
    };

    onMounted(async () => {
      isLoading.value = true;
      try {
        // Предполагается, что данные уже загружены в Vuex
        // Если данные загружаются асинхронно, вызовите соответствующее действие Vuex
        // Например:
        // await store.dispatch('fetchEntry', entryId);
        // Здесь мы предполагаем, что данные уже присутствуют
      } catch (err) {
        error.value = 'Не удалось загрузить запись.';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      entry,
      filteredEntry,
      getColumnName,
      getFieldLabel,
      formatValue,
      goBack,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped>
.view-entry {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.view-entry h2 {
  margin-bottom: 20px;
}

.view-entry h3 {
  margin-top: 20px;
}

.view-entry div {
  margin-bottom: 10px;
  word-wrap: break-word;
}

.btn-secondary {
  margin-bottom: 20px;
  border-radius: 50px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>