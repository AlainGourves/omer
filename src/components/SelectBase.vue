<template>
  <div>
    <label :for="name">{{label}}</label>
    <select :id="name">
      <option value="all">{{default}}</option>
      <option v-for="option in options" :value="option.id">{{option.name}}</option>
    </select>
  </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        default: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selected: ''
        }
    },
    methods: {
        updateValue(value) {
            this.$emit('input', value)
        }
    }
}
</script>
<style></style>
