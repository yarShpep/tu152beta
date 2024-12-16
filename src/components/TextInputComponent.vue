<!-- src/components/TextInputComponent.vue -->
<template>
  <input
      :type="type"
      v-model="internalValue"
      :id="id"
      :required="required"
  />
</template>

<script>
export default {
  name: 'TextInputComponent',
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
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>