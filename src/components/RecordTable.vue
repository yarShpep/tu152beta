<!-- src/components/RecordTable.vue -->
<template>
  <table class="record-table">
    <thead>
    <tr>
      <th v-for="header in headers" :key="header">{{ header }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(entry, index) in entries" :key="index">
      <td v-for="header in headers" :key="header">
        {{ getEntryField(entry, header) }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'RecordTable',
  props: {
    entries: {
      type: Array,
      required: true,
    },
  },
  computed: {
    headers() {
      return [
        'Дата',
        'Время (часы, минуты)',
        'Станция',
        // Добавьте остальные заголовки
      ];
    },
  },
  methods: {
    getEntryField(entry, header) {
      // Преобразуйте данные записи в соответствии с заголовками
      // Например:
      switch (header) {
        case 'Дата':
          return entry['1']?.['Дата'] || '-';
        case 'Время (часы, минуты)':
          return entry['1']?.['Время (часы, минуты)'] || '-';
        case 'Станция':
          return entry['1']?.['Станция'] || '-';
          // Добавьте остальные случаи
        default:
          return '-';
      }
    },
  },
};
</script>

<style>
.record-table {
  width: 100%;
  border-collapse: collapse;
}

.record-table th,
.record-table td {
  border: 1px solid #cccccc;
  padding: 8px;
}

.record-table th {
  background-color: #f9f9f9;
}
</style>