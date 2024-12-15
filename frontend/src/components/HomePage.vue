<!-- HomePage.vue -->
<template>
  <div class="home-page">
    <h1>Журнал ТУ-152</h1>
    <div class="button-container">
      <button class="btn-primary" @click="goToAddEntry">Добавить запись</button>
      <button class="btn-secondary" @click="downloadJSON">JSON</button>
    </div>

    <RecordTable :entries="entries" />

    <PaginationComponent
        v-model="currentPage"
        :totalPages="totalPages"
        :isLoading="isLoading"
    />

    <div v-if="isLoading" class="loading-indicator">
      Загрузка...
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import RecordTable from './RecordTable.vue';
import PaginationComponent from './PaginationComponent.vue';

export default {
  name: 'HomePage',
  components: {
    RecordTable,
    PaginationComponent,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const entries = computed(() => store.getters.allEntries);
    const totalPages = computed(() => store.getters.totalPages);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const error = ref(null);

    const goToAddEntry = () => {
      router.push('/add-entry');
    };

    const downloadJSON = () => {
      if (!entries.value || entries.value.length === 0) {
        alert('Нет данных для скачивания.');
        return;
      }

      const jsonStr = JSON.stringify(entries.value, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', url);
      downloadAnchorNode.setAttribute('download', 'entries.json');
      document.body.appendChild(downloadAnchorNode); // Required for Firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      URL.revokeObjectURL(url); // Освобождаем память
    };

    const handlePageChange = async (page) => {
      isLoading.value = true;
      error.value = null;
      try {
        await store.dispatch('fetchEntries', { page });
        currentPage.value = page;
      } catch (err) {
        error.value = 'Не удалось загрузить записи. Пожалуйста, попробуйте позже.';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      isLoading.value = true;
      try {
        await store.dispatch('fetchEntries', { page: currentPage.value });
      } catch (err) {
        error.value = 'Не удалось загрузить записи. Пожалуйста, попробуйте позже.';
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      entries,
      totalPages,
      currentPage,
      goToAddEntry,
      downloadJSON,
      handlePageChange,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped>
.home-page {
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

.loading-indicator {
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: red;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}
</style>