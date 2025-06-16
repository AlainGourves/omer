<template>
  <div>
    <label :for="name">{{label}}&nbsp;:</label>
    <select :id="name" v-model="selectedValue" @change="onChange()">
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
        func: {
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
            selectedValue: 'all'
        }
    },
    methods: {
        onChange() {
            this.$emit(`${this.func}-${this.name}`, this.selectedValue);
        }
    }
}
</script>
<style></style>
