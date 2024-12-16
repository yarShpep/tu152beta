<!-- src/components/ViewEntry.vue -->
<template>
  <div class="view-entry">
    <button class="btn-secondary" @click="goBack">&lt; Назад</button>
    <h2>Просмотр записи</h2>
    <div v-if="filteredEntry">
      <!-- Используем filteredEntry для отображения -->
      <div
          v-for="(columnData, columnId) in filteredEntry"
          :key="columnId"
      >
        <h3>{{ getColumnName(columnId) }}</h3>
        <div v-for="(value, key) in columnData" :key="key">
          <strong>{{ getFieldLabel(columnId, key) }}:</strong>
          {{ formatValue(value, key) }}
        </div>
      </div>
    </div>
    <div v-else>
      <p>Запись не найдена.</p>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ViewEntry',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const entryId = route.params.id;

    const entry = computed(() =>
        store.state.entries.find((e) => e.id === entryId)
    );

    // Определяем список допустимых колонок, исключая 6-й столбец с id '5'
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

    // Создаём список допустимых ключей колонок
    const allowedColumnIds = columns.map((col) => col.id);

    // Фильтруем entry, оставляя только допустимые колонки
    const filteredEntry = computed(() => {
      if (!entry.value) return null;

      const newEntry = {};

      for (const key of allowedColumnIds) {
        if (Object.prototype.hasOwnProperty.call(entry.value, key)) {
          newEntry[key] = entry.value[key];
        }
      }

      return newEntry;
    });

    const getColumnName = (columnId) => {
      const column = columns.find((col) => col.id === columnId);
      return column ? column.name : 'Неизвестный столбец';
    };

    const getFieldLabel = (columnId, fieldName) => {
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        let field;
        if (column.fields) {
          field = column.fields.find((f) => f.name === fieldName);
        } else if (column.subcolumns) {
          for (const subcol of column.subcolumns) {
            field = subcol.fields.find((f) => f.name === fieldName);
            if (field) break;
          }
        }
        return field ? field.label : fieldName;
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
      return value || '-';
    };

    const goBack = () => {
      router.push('/');
    };

    return {
      entry,
      filteredEntry,
      getColumnName,
      getFieldLabel,
      formatValue,
      goBack,
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
</style>