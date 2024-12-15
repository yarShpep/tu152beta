<!-- src/components/TextareaComponent.vue -->
<template>
  <div>
    <label v-if="label" :for="id" class="textarea-label">{{ label }}</label>
    <textarea
        v-model="internalValue"
        :id="id"
        :placeholder="placeholder"
        :maxlength="maxLength"
        rows="4"
        v-bind="$attrs"
    ></textarea>
    <div v-if="showCharCount" class="char-count">
      {{ internalValue.length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextareaComponent',
  inheritAttrs: false, // Отключаем автоматическое наследование атрибутов
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: null,
    },
    showCharCount: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    optionsList() {
      // Этот метод может быть удалён, так как он не используется в данном компоненте
      return [];
    },
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
.textarea-label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 8px;
  resize: vertical;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #555;
  margin-top: 4px;
}
</style>