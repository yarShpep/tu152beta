<!-- src/components/HomePage.vue -->
<template>
  <div class="home">
    <h1>Журнал ТУ-152</h1>
    <div class="button-container">
      <button class="btn-primary" @click="goToAddEntry">Добавить запись</button>
      <button class="btn-secondary" @click="downloadJSON">JSON</button>
    </div>
    <div class="record-table-container">
      <RecordTable :entries="entries" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import RecordTable from './RecordTable.vue';

export default {
  name: 'HomePage',
  components: {
    RecordTable,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const entries = computed(() => store.state.entries);

    const goToAddEntry = () => {
      router.push('/add-entry');
    };

    const downloadJSON = () => {
      const dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(JSON.stringify(entries.value, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'entries.json');
      document.body.appendChild(downloadAnchorNode); // Required for Firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    return {
      entries,
      goToAddEntry,
      downloadJSON,
    };
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 100%;
  overflow-x: hidden;
}

.button-container {
  margin-bottom: 20px;
}

.btn-primary {
  margin-right: 10px;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #6c757d;
}

.btn-secondary:hover {
  background-color: #d6d6d6;
}

.record-table-container {
  overflow-x: auto;
}
</style>