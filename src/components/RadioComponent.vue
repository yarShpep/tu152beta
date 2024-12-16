<!-- src/components/RadioComponent.vue -->
<template>
  <div>
    <label v-for="option in options" :key="option.value" class="radio-label">
      <input
          type="radio"
          :value="option.value"
          :name="id"
      @change="onChange(option.value)"
      :checked="modelValue === option.value"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'RadioComponent',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onChange(value) {
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style scoped>
.radio-label {
  display: block;
  margin-bottom: 8px;
}
</style>