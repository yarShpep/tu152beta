<!-- src/components/TextareaComponent.vue -->
<template>
  <textarea
      v-model="internalValue"
      :id="id"
      rows="4"
  ></textarea>
</template>

<script>
export default {
  name: 'TextareaComponent',
  props: {
    modelValue: {
      type: String,
      default: '',
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
textarea {
  width: 100%;
  padding: 8px;
  resize: vertical;
}
</style>