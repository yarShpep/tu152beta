<template>
  <div class="home">
    <h1>Журнал ТУ-152</h1>
    <RecordTable :entries="paginatedEntries" />
    <PaginationComponent
        :totalPages="totalPages"
        @page-changed="onPageChanged"
    />
    <button class="btn-primary" @click="goToAddEntry">
      Добавить запись
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import RecordTable from './RecordTable.vue';
import PaginationComponent from './PaginationComponent.vue';

export default {
  name: 'HomePage',
  components: {
    RecordTable,
    PaginationComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const entries = computed(() => store.state.entries);
    const currentPage = ref(1);
    const entriesPerPage = 10;

    const paginatedEntries = computed(() => {
      const start = (currentPage.value - 1) * entriesPerPage;
      const end = start + entriesPerPage;
      return entries.value.slice(start, end);
    });

    const totalPages = computed(() =>
        Math.ceil(entries.value.length / entriesPerPage)
    );

    const onPageChanged = (page) => {
      currentPage.value = page;
    };

    const goToAddEntry = () => {
      router.push('/add-entry');
    };

    return {
      paginatedEntries,
      totalPages,
      onPageChanged,
      goToAddEntry,
    };
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>