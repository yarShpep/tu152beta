<!-- src/components/SelectComponent.vue -->
<template>
  <select v-model="internalValue" :id="id">
    <option value="" disabled>Выберите</option>
    <option
        v-for="option in optionsList"
        :key="option.id || option"
        :value="option.id || option"
    >
      {{ option.name || option }}
    </option>
  </select>
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
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>

<style scoped>
select {
  width: 100%;
  padding: 8px;
}
</style>