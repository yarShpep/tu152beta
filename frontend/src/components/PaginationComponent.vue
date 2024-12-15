<!-- PaginationComponent.vue -->
<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
        class="btn-secondary"
        :disabled="currentPage === 1 || isLoading"
        @click="changePage(currentPage - 1)"
        aria-label="Перейти на предыдущую страницу"
    >
      Предыдущая
    </button>
    <span>Страница {{ currentPage }} из {{ totalPages }}</span>
    <button
        class="btn-secondary"
        :disabled="currentPage === totalPages || isLoading"
        @click="changePage(currentPage + 1)"
        aria-label="Перейти на следующую страницу"
    >
      Следующая
    </button>
    <span v-if="isLoading" class="loading-spinner" aria-live="polite">🔄</span>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'PaginationComponent',
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentPage = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const changePage = (page) => {
      if (page >= 1 && page <= props.totalPages && !props.isLoading) {
        currentPage.value = page;
      }
    };

    return {
      currentPage,
      changePage,
    };
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.pagination button {
  margin: 0 10px;
}
.loading-spinner {
  margin-left: 10px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>