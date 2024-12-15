<!-- src/components/SelectComponent.vue -->
<template>
  <div>
    <label
        v-for="option in optionsList"
        :key="option.id || option"
        :for="`${id}-${option.id || option}`"
        class="select-label"
    >
      <input
          type="radio"
          :id="`${id}-${option.id || option}`"
          :value="option.id || option"
          :name="id"
          v-model="internalValue"
      />
      {{ option.name || option }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'SelectComponent',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    options: {
      type: String, // 'employees' or 'positions'
      required: true,
      validator(value) {
        return ['employees', 'positions'].includes(value);
      },
    },
  },
  computed: {
    optionsList() {
      if (this.options === 'employees') {
        return this.$store.state.employees;
      } else if (this.options === 'positions') {
        return this.$store.state.positions;
      }
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
.select-label {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
}

.select-label input {
  margin-right: 8px;
}
</style>