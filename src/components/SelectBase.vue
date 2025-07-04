<template>
  <div>
    <label :for="name">{{ label }}&nbsp;:</label>
    <select :id="name" v-model="selectedValue" @change="onChange()" class="select" :disabled="loading ? true : null">
      <option value="all">{{default}}</option>
      <option v-for="option in options" :value="option.id">{{ option.name }}</option>
    </select>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    fn: {
      type: String,
      required: true,
    },
    default: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedValue: 'all',
    }
  },
  methods: {
    onChange() {
      this.$emit(`${this.fn}-${this.name}`, this.selectedValue)
    },
  },
}
</script>
<style lang="scss">
/* class applies to select element itself, not a wrapper element */
.select {
  display: block;
  font-size: 16px;
  font-family: inherit;
  font-weight: 600;
  color: inherit;
  line-height: 1.1;
  padding: 0.5em 2em 0.5em 0.5em;
  max-width: 100%; /* useful when width is set to anything other than 100% */
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  appearance: none;
  background-color: #fff;
  /* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient.
		for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference

	*/
  background-image:
    url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  /* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
  background-position:
    right 0.7em top 50%,
    0 0;
  /* icon size, then gradient */
  background-size:
    0.65em auto,
    100%;
}
/* Hover style */
.select:hover {
  border-color: #888;
}
/* Focus style */
.select:focus {
  border-color: #aaa;
  /* It'd be nice to use -webkit-focus-ring-color here but it doesn't work on box-shadow */
  box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222;
  outline: none;
}

/* Set options to normal weight */
.select option {
  font-weight: normal;
}

/* Disabled styles */
.select:disabled,
.select-css[aria-disabled='true'] {
  color: graytext;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M98.15 23.74a6.01 6.01 0 0 0-4.45-1.85H6.29c-1.71 0-3.18.62-4.41 1.85A6.01 6.01 0 0 0 0 28.11c0 1.71.62 3.18 1.85 4.41l43.78 43.74c1.23 1.23 2.67 1.85 4.38 1.85s3.15-.62 4.38-1.85l43.78-43.78c1.2-1.2 1.85-2.67 1.85-4.38s-.65-3.15-1.88-4.38h.03z'/%3E%3C/svg%3E%0A"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
}

.select-css:disabled:hover,
.select-css[aria-disabled='true'] {
  border-color: #aaa;
}
</style>
