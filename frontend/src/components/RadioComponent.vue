<!-- src/components/RadioComponent.vue -->
<template>
  <div>
    <label
        v-for="option in options"
        :key="option.value"
        :for="`${id}-${option.value}`"
        class="radio-label"
    >
      <input
          type="radio"
          :id="`${id}-${option.value}`"
          :value="option.value"
          :name="id"
          v-model="internalValue"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(
          (option) =>
              Object.prototype.hasOwnProperty.call(option, 'value') &&
              Object.prototype.hasOwnProperty.call(option, 'label')
      );
    },
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>

<style scoped>
.radio-label {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
}

.radio-label input {
  margin-right: 8px;
}
</style>