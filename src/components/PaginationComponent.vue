<!-- src/components/PaginationComponent.vue -->
<template>
  <div class="pagination">
    <button
        class="btn-secondary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
    >
      Предыдущая
    </button>
    <span>Страница {{ currentPage }} из {{ totalPages }}</span>
    <button
        class="btn-secondary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
    >
      Следующая
    </button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'PaginationComponent',
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const currentPage = ref(1);

    const changePage = (page) => {
      if (page >= 1 && page <= props.totalPages) {
        currentPage.value = page;
        emit('page-changed', page);
      }
    };

    watch(
        () => props.totalPages,
        (newVal) => {
          if (currentPage.value > newVal) {
            changePage(newVal);
          }
        }
    );

    return {
      currentPage,
      changePage,
    };
  },
};
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}
</style>