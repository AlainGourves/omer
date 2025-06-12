<template>
  <div class="total">{{ total }} recettes</div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
}
</script>
<style>
.total{
    margin-block-end: 1em;
}
</style>
