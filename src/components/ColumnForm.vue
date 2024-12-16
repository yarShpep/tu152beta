<!-- src/components/ColumnForm.vue -->
<template>
  <div class="column-form" v-if="column">
    <h2>{{ column.name }}</h2>
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
import { computed, reactive, watch } from 'vue';
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

    const columns = [
      {
        id: '1',
        name: 'Дата, время, станция смены',
        fields: [
          { name: 'date', label: 'Дата', type: 'date', optional: false, placeholder: 'Введите дату' },
          { name: 'direction', label: 'Направление', type: 'text', optional: false, placeholder: 'Введите направление' },
          { name: 'train', label: 'Поезд', type: 'text', optional: false, placeholder: 'Введите номер поезда' },
          { name: 'weight', label: 'Вес (кг)', type: 'number', optional: false, placeholder: 'Введите вес' },
          { name: 'axles', label: 'Оси', type: 'text', optional: false, placeholder: 'Введите количество осей' },
          { name: 'acceptanceTime', label: 'Время (Начало приемки)', type: 'time', optional: false },
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
              {
                name: 'arrivalDriver',
                label: 'ФИО Машиниста Прибывающего',
                type: 'text',
                optional: false,
                placeholder: 'Введите ФИО машиниста',
              },
              {
                name: 'arrivalAssistant',
                label: 'ФИО Помощника Прибывающего',
                type: 'text',
                optional: true,
                placeholder: 'Введите ФИО помощника (опционально)',
              },
              {
                name: 'arrivalTime',
                label: 'Сдал (Время сдачи)',
                type: 'time',
                optional: false,
              },
            ],
          },
          {
            id: '2.2',
            name: 'Отправляющегося (принимающего)',
            fields: [
              {
                name: 'departureDriver',
                label: 'ФИО Машиниста Отправляющего',
                type: 'text',
                optional: false,
                placeholder: 'Введите ФИО машиниста',
              },
              {
                name: 'departureAssistant',
                label: 'ФИО Помощника Отправляющего',
                type: 'text',
                optional: true,
                placeholder: 'Введите ФИО помощника (опционально)',
              },
              {
                name: 'departureTime',
                label: 'Принял (Время приема)',
                type: 'time',
                optional: false,
              },
            ],
          },
        ],
      },
      {
        id: '3',
        name: 'Наличие топлива в момент приемки',
        fields: [
          {
            name: 'fuelOption',
            label: 'Выберите опцию:',
            type: 'radio',
            options: [
              { value: 'fuel', label: 'Наличие топлива' },
              { value: 'electricity', label: 'Показание счетчика электроэнергии' },
            ],
            optional: false,
          },
          {
            name: 'fuelAmount',
            label: 'Количество топлива (кг)',
            type: 'number',
            dependency: { field: 'fuelOption', value: 'fuel' },
            optional: false,
            placeholder: 'Введите количество топлива',
          },
          {
            name: 'electricityReading',
            label: 'Показание счетчика электроэнергии',
            type: 'text',
            dependency: { field: 'fuelOption', value: 'electricity' },
            optional: false,
            placeholder: 'Введите показание счетчика',
          },
        ],
      },
      {
        id: '4',
        name: 'Замечания и неисправности',
        fields: [
          { name: 'comments', label: 'Замечания и неисправности', type: 'textarea', optional: false, placeholder: 'Введите замечания' },
          { name: 'signatureGiven', label: 'Подпись сдающего машиниста', type: 'checkbox', optional: false },
          { name: 'signatureReceived', label: 'Подпись принимающего машиниста', type: 'checkbox', optional: false },
        ],
      },
      {
        id: '5',
        name: 'Дата устранения неисправности',
        fields: [
          { name: 'repairDate', label: 'Дата устранения', type: 'date', optional: false },
          { name: 'position', label: 'Должность лица', type: 'text', optional: false, placeholder: 'Введите должность' },
          { name: 'signature', label: 'Подпись', type: 'checkbox', optional: false },
        ],
      },
      // Добавьте остальные столбцы, если необходимо
    ];

    const column = computed(() => {
      return columns.find((col) => col.id === route.params.id);
    });

    if (!column.value) {
      console.error('Колонка не найдена для ID:', route.params.id);
      router.push('/add-entry');
      return {};
    }

    // Загрузка сохранённых данных для текущего столбца
    const formData = reactive({ ...store.state.currentEntry[column.value.id] });

    // Инициализация fuelOption, если оно не задано
    if (column.value.id === '3' && !formData.fuelOption) {
      formData.fuelOption = '';
    }

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

    const saveColumnData = () => {
      console.log('Кнопка "Сохранить" нажата');
      console.log('Данные формы:', { ...formData });

      if (!column.value) {
        console.error('Колонка не найдена при сохранении');
        return;
      }

      // Сохранение данных в Vuex
      store.commit('UPDATE_CURRENT_ENTRY', { [column.value.id]: { ...formData } });
      console.log('Данные сохранены в Vuex:', store.state.currentEntry);

      // Перенаправление
      router.push('/add-entry');
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