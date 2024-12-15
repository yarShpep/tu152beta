<!-- src/components/CheckboxComponent.vue -->
<template>
  <input
      type="checkbox"
      :id="id"
      v-model="internalValue"
  />
</template>

<script>
export default {
  name: 'CheckboxComponent',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
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
input[type='checkbox'] {
  width: 20px;
  height: 20px;
}
</style>