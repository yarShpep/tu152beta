<!-- src/components/RecordTable.vue -->
<template>
    <table class="record-table">
      <thead>
      <tr>
        <th rowspan="2">Дата, время, станция смены локомотивной бригады</th>
        <th colspan="2">Фамилия машиниста</th>
        <th rowspan="2">Наличие топлива в момент приемки</th>
        <th rowspan="2">Замечания и неисправности</th>
        <th rowspan="2">Дата устранения неисправности</th>
        <th rowspan="2">Действия</th>
      </tr>
      <tr>
        <th>Прибывающего (сдающего)</th>
        <th>Отправляющегося (принимающего)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(entry, index) in sortedEntries" :key="entry.id || index">
        <!-- Первый столбец -->
        <td>
          {{ entry['1'].date }}<br />
          Направление: {{ entry['1'].direction }}<br />
          Поезд: {{ entry['1'].train }}<br />
          Вес: {{ entry['1'].weight }} кг<br />
          Оси: {{ entry['1'].axles }}<br />
          Время: {{ entry['1'].acceptanceTime }}
        </td>
        <!-- Второй столбец - Прибывающего -->
        <td>
          ФИО Машиниста: {{ entry['2'].arrivalDriver || '-' }}<br />
          ФИО Помощника: {{ entry['2'].arrivalAssistant || '-' }}<br />
          Сдал: {{ entry['2'].arrivalTime }}
        </td>
        <!-- Третий столбец - Отправляющегося -->
        <td>
          ФИО Машиниста: {{ entry['2'].departureDriver || '-' }}<br />
          ФИО Помощника: {{ entry['2'].departureAssistant || '-' }}<br />
          Принял: {{ entry['2'].departureTime }}
        </td>
        <!-- Четвёртый столбец -->
        <td>
          <div>
            {{ getFuelOptionLabel(entry['3'].fuelOption) }}
          </div>
          <div v-if="entry['3'].fuelOption === 'fuel'">
            Количество топлива: {{ entry['3'].fuelAmount || '-' }} кг
          </div>
          <div v-if="entry['3'].fuelOption === 'electricity'">
            Показание счетчика электроэнергии: {{ entry['3'].electricityReading || '-' }}
          </div>
        </td>
        <!-- Пятый столбец -->
        <td>
          Замечания и неисправности:
          {{ truncateText(entry['4'].comments, 100) }}<br />
          Подпись сдающего: {{ entry['4'].signatureGiven ? 'Да' : 'Нет' }}<br />
          Подпись принимающего: {{ entry['4'].signatureReceived ? 'Да' : 'Нет' }}
        </td>
        <!-- Шестой столбец -->
        <td>
          Дата устранения неисправности: {{ entry['5'].repairDate }}<br />
          Должность: {{ entry['5'].position }}<br />
          Подпись: {{ entry['5'].signature ? 'Да' : 'Нет' }}
        </td>
        <!-- Седьмой столбец - Действия -->
        <td class="actions-cell">
          <ActionDropdown :entryId="entry.id" />
        </td>
      </tr>
      </tbody>
    </table>
</template>

<script>
import ActionDropdown from './ActionDropdown.vue';

export default {
  name: 'RecordTable',
  props: {
    entries: {
      type: Array,
      required: true,
    },
  },
  computed: {
    sortedEntries() {
      return [...this.entries].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id);
        const dateB = new Date(b.createdAt || b.id);
        return dateB - dateA; // Сортировка в обратном хронологическом порядке
      });
    },
  },
  components: {
    ActionDropdown,
  },
  methods: {
    getFuelOptionLabel(option) {
      switch (option) {
        case 'fuel':
          return 'Наличие топлива в момент приемки';
        case 'electricity':
          return 'Показание счетчика электроэнергии в момент приемки';
        default:
          return '-';
      }
    },
    truncateText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text || '-';
    },
  },
};
</script>

<style scoped>

.record-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background-color);
}

.record-table th,
.record-table td {
  border: 1px solid var(--border-color);
  padding: 12px;
  vertical-align: top;
  max-width: 200px;
}

.record-table th {
  background-color: var(--light-color);
  font-weight: bold;
  font-size: 16px;
}

.record-table tbody tr:nth-child(even) {
  background-color: var(--light-color);
}

.record-table td {
  word-wrap: break-word;
}

.actions-cell {
  text-align: center;
}

@media (max-width: 767px) {
  .record-table th,
  .record-table td {
    font-size: 14px;
    padding: 8px;
  }

  .record-table th {
    font-size: 16px;
  }
}
</style>