<!-- src/components/TextInputComponent.vue -->
<template>
  <div>
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
        :type="type"
        v-model="internalValue"
        :id="id"
        :required="required"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        v-bind="$attrs"
    />
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextInputComponent',
  inheritAttrs: false, // Отключаем автоматическое наследование атрибутов
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: { // Новый пропс
      type: String,
      default: '',
    },
    label: { // Новый пропс для метки
      type: String,
      default: '',
    },
    disabled: { // Новый пропс
      type: Boolean,
      default: false,
    },
    maxLength: { // Новый пропс
      type: Number,
      default: null,
    },
    errorMessage: { // Новый пропс для отображения сообщения об ошибке
      type: String,
      default: '',
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>