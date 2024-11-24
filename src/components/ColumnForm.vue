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
              v-bind="field.type !== 'checkbox' ? {} : { 'aria-label': field.label }"
          ></component>
        </div>
      </div>

      <div v-if="!formValid" class="error-message">
        Пожалуйста, заполните все обязательные поля.
      </div>

      <button class="btn-primary" type="submit" :disabled="!formValid">
        Сохранить
      </button>
      <button class="btn-secondary" type="button" @click="cancel">Отменить</button>
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
        name: 'Дата, время (час, мин.), станция смены локомотивной бригады',
        fields: [
          { name: 'date', label: 'Дата', type: 'date', optional: false },
          { name: 'direction', label: 'Направление', type: 'text', optional: false },
          { name: 'train', label: 'Поезд', type: 'text', optional: false },
          { name: 'weight', label: 'Вес (кг)', type: 'number', optional: false },
          { name: 'axles', label: 'Оси', type: 'text', optional: false },
          { name: 'acceptanceTime', label: 'Время (Начало приемки)', type: 'time', optional: false },
        ],
      },
      {
        id: '2',
        name: 'Фамилия машиниста',
        subcolumns: [
          {
            id: '2.1',
            name: 'Прибывающего (сдающего), станция, откуда прибыл и № поезда',
            fields: [
              {
                name: 'arrivalDriver',
                label: 'ФИО Машиниста Прибывающего',
                type: 'text',
                optional: false,
              },
              {
                name: 'arrivalAssistant',
                label: 'ФИО Помощника машиниста Прибывающего',
                type: 'text',
                optional: true,
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
              },
              {
                name: 'departureAssistant',
                label: 'ФИО Помощника машиниста Отправляющего',
                type: 'text',
                optional: true,
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
            label: 'Выберите опцию:', // Групповая метка для радиокнопок
            type: 'radio',
            options: [
              { value: 'fuel', label: 'Наличие топлива в момент приемки'},
              { value: 'electricity', label: 'Показание счетчика электроэнергии в момент приемки' },
            ],
            optional: false,
          },
          {
            name: 'fuelAmount',
            label: 'Количество топлива (кг)',
            type: 'int',
            dependency: { field: 'fuelOption', value: 'fuel' },
            optional: false,
          },
          {
            name: 'electricityReading',
            label: 'Показание счетчика электроэнергии',
            type: 'text',
            dependency: { field: 'fuelOption', value: 'electricity' },
            optional: false,
          },
        ],
      },
      {
        id: '4',
        name: 'Замечания и неисправности',
        fields: [
          { name: 'comments', label: 'Замечания и неисправности', type: 'textarea', optional: false },
          { name: 'signatureGiven', label: 'Подпись сдающего машиниста', type: 'checkbox', optional: false },
          { name: 'signatureReceived', label: 'Подпись принимающего машиниста', type: 'checkbox', optional: false },
        ],
      },
      {
        id: '5',
        name: 'Дата устранения неисправности',
        fields: [
          { name: 'repairDate', label: 'Дата устранения неисправности', type: 'date', optional: false },
          { name: 'position', label: 'Должность лица', type: 'text', optional: false },
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
    }

    // Загрузка сохранённых данных для текущего столбца
    const formData = reactive(store.state.currentEntry[column.value.id] || {});

    // Инициализация fuelOption, если оно не задано
    if (column.value.id === '3' && !formData.fuelOption) {
      formData.fuelOption = ''; // Или можно установить значение по умолчанию, например 'fuel'
    }

    // Сохранение изменений формы в store при изменении formData
    watch(
        () => ({ ...formData }),
        (newVal) => {
          store.commit('UPDATE_CURRENT_ENTRY', { [column.value.id]: { ...newVal } });
          console.log('FormData updated:', newVal); // Отладочный лог
        },
        { deep: true }
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
          return formData[field.name];
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
      displayedFields,
      saveColumnData,
      cancel,
    };
  },
};
</script>

<style>
.column-form {
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.group-label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}
.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>