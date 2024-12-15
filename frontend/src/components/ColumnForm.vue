<!-- src/components/ColumnForm.vue -->
<template>
  <div class="column-form" v-if="column">
    <h2>{{ isEditMode ? 'Редактировать запись' : 'Добавить новую запись' }}</h2>
    <form @submit.prevent="saveColumnData">
      <div
          v-for="field in displayedFields"
          :key="field.name"
          class="form-group"
      >
        <!-- Разделение групповой метки и компонента радиокнопок -->
        <div v-if="field.type === 'radio'">
          <label class="group-label">{{ field.label }}</label>
          <RadioComponent
              v-model="formData[field.name]"
              :id="field.name"
              :options="field.options"
          />
        </div>

        <!-- Остальные типы полей -->
        <div v-else>
          <label v-if="field.label" :for="field.name">{{ field.label }}</label>
          <component
              :is="getComponentType(field)"
              v-model="formData[field.name]"
              :id="field.name"
              :type="field.type"
              :required="!field.optional"
              v-bind="getComponentProps(field)"
          ></component>
        </div>
      </div>

      <div v-if="!formValid" class="error-message">
        Пожалуйста, заполните все обязательные поля.
      </div>

      <div class="button-group">
        <button
            :class="['btn', formValid ? 'btn-success' : 'btn-disabled']"
            type="submit"
            :disabled="!formValid"
        >
          Сохранить
        </button>
        <button class="btn btn-secondary" type="button" @click="cancel">Отменить</button>
      </div>
    </form>
  </div>
  <div v-else>
    <p>Колонка не найдена.</p>
  </div>
</template>

<script>
import { computed, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import RadioComponent from './RadioComponent.vue';
import TextInputComponent from './TextInputComponent.vue';
import TextareaComponent from './TextareaComponent.vue';
import CheckboxComponent from './CheckboxComponent.vue';

export default {
  name: 'ColumnForm',
  components: {
    RadioComponent,
    TextInputComponent,
    TextareaComponent,
    CheckboxComponent,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isEditMode = computed(() => Boolean(route.params.id));

    const columns = [
      // ... ваш массив колонок
    ];

    const column = computed(() => {
      return columns.find((col) => col.id === route.params.id);
    });

    if (!column.value && isEditMode.value) {
      console.error('Колонка не найдена для ID:', route.params.id);
      router.push('/add-entry');
      return {};
    }

    const formData = reactive({});

    onMounted(async () => {
      if (isEditMode.value) {
        await store.dispatch('fetchEntryById', route.params.id);
        Object.assign(formData, store.state.currentEntry);
      } else {
        // Инициализация formData для новой записи
        columns.forEach(col => {
          col.fields.forEach(field => {
            formData[field.name] = field.type === 'checkbox' ? false : '';
          });
          if (col.subcolumns) {
            col.subcolumns.forEach(subcol => {
              subcol.fields.forEach(field => {
                formData[field.name] = field.type === 'checkbox' ? false : '';
              });
            });
          }
        });
      }

      // Инициализация fuelOption, если оно не задано
      if (column.value.id === '3' && !formData.fuelOption) {
        formData.fuelOption = '';
      }
    });

    // Наблюдатель за fuelOption для очистки противоположного поля
    watch(
        () => formData.fuelOption,
        (newVal) => {
          if (newVal === 'fuel') {
            formData.electricityReading = '';
          } else if (newVal === 'electricity') {
            formData.fuelAmount = '';
          } else {
            formData.fuelAmount = '';
            formData.electricityReading = '';
          }
        }
    );

    // Функция проверки зависимости поля
    const shouldDisplayField = (field) => {
      if (field.dependency) {
        return formData[field.dependency.field] === field.dependency.value;
      }
      return true;
    };

    // Вычисляемое свойство для отображаемых полей с учетом зависимостей
    const displayedFields = computed(() => {
      if (!column.value) return [];

      if (column.value.subcolumns) {
        return column.value.subcolumns.flatMap((subcol) =>
            subcol.fields.filter((field) => shouldDisplayField(field))
        );
      }

      return column.value.fields.filter((field) => shouldDisplayField(field));
    });

    const formValid = computed(() => {
      return displayedFields.value.every((field) => {
        if (!field.optional) {
          const value = formData[field.name];
          if (field.type === 'checkbox') {
            return value === true;
          } else if (field.type === 'number') {
            return value !== undefined && value !== null && value !== '';
          } else {
            return value !== undefined && value !== null && value.toString().trim() !== '';
          }
        }
        return true;
      });
    });

    const getComponentType = (field) => {
      switch (field.type) {
        case 'radio':
          return 'RadioComponent';
        case 'textarea':
          return 'TextareaComponent';
        case 'checkbox':
          return 'CheckboxComponent';
        case 'text':
        case 'number':
        case 'date':
        case 'time':
          return 'TextInputComponent';
        default:
          return 'input';
      }
    };

    // Функция для получения дополнительных свойств компонента
    const getComponentProps = (field) => {
      const props = {};

      if (field.type !== 'checkbox') {
        if (field.placeholder) {
          props.placeholder = field.placeholder;
        }
      } else {
        props['aria-label'] = field.label;
      }

      return props;
    };

    const saveColumnData = async () => {
      console.log('Кнопка "Сохранить" нажата');
      console.log('Данные формы:', { ...formData });

      if (!column.value) {
        console.error('Колонка не найдена при сохранении');
        return;
      }

      try {
        if (isEditMode.value) {
          await store.dispatch('updateEntry', { id: route.params.id, data: { ...formData } });
          alert('Запись успешно обновлена!');
        } else {
          await store.dispatch('addEntry', { data: { ...formData } });
          alert('Запись успешно добавлена!');
        }
        router.push('/add-entry');
      } catch (error) {
        console.error('Ошибка при сохранении записи:', error);
        alert('Не удалось сохранить запись. Проверьте введённые данные и попробуйте снова.');
      }
    };

    const cancel = () => {
      console.log('Кнопка "Отменить" нажата');
      router.push('/add-entry');
    };

    return {
      column,
      formData,
      formValid,
      getComponentType,
      getComponentProps,
      displayedFields,
      saveColumnData,
      cancel,
      isEditMode,
    };
  },
};
</script>

<style scoped>
.column-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--light-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.column-form h2 {
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
}

.group-label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
}

.button-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}

.button-group button {
  margin-right: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Стили для активной кнопки "Сохранить" */
.btn-success {
  background-color: var(--success-color);
  color: #ffffff;
}

.btn-success:hover {
  background-color: var(--success-color-hover);
}

/* Стили для неактивной кнопки "Сохранить" */
.btn-disabled {
  background-color: #6c757d; /* Тёмно-серый цвет */
  color: #ffffff;
  border: 2px solid #6c757d;
  cursor: not-allowed;
}

.btn-disabled:hover {
  background-color: #6c757d; /* Цвет не меняется при наведении */
}

/* Стили для кнопки "Отменить" */
.btn-secondary {
  background-color: var(--secondary-color);
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: var(--secondary-color-hover);
}

.error-message {
  color: var(--danger-color);
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}
</style>