<!-- src/components/ActionDropdown.vue -->
<template>
  <div class="action-dropdown" @click.stop="toggleDropdown">
    <button class="dropdown-button">Действия</button>
    <div v-if="isOpen" class="dropdown-menu">
      <button class="dropdown-item" @click.stop="viewEntry">Просмотреть</button>
      <!-- Добавьте другие действия здесь -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ActionDropdown',
  props: {
    entryId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isOpen = ref(false);
    const router = useRouter();

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const viewEntry = () => {
      isOpen.value = false; // Закрываем выпадающее меню
      router.push(`/view-entry/${props.entryId}`);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-dropdown')) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      isOpen,
      toggleDropdown,
      viewEntry,
    };
  },
};
</script>

<style scoped>
.action-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: white;
  color: #007bff;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 50px;
  white-space: nowrap;
}

.dropdown-button:hover {
  background-color: #f0f0f0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0; /* Позиционируем меню относительно правого края */
  background-color: white;
  border: 1px solid #cccccc;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  max-width: 200px;
  z-index: 1;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 10px;
  background-color: white;
  color: #007bff;
  text-align: left;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>