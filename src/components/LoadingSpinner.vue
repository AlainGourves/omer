<template>
  <div class="loading">
    <div class="loading-wrapper">
      <div class="loading-anim">
        <div style="--i: 0"></div>
        <div style="--i: 1"></div>
        <div style="--i: 2"></div>
        <div style="--i: 3"></div>
        <div style="--i: 4"></div>
        <div style="--i: 5"></div>
        <div style="--i: 6"></div>
        <div style="--i: 7"></div>
        <div style="--i: 8"></div>
        <div style="--i: 9"></div>
        <div style="--i: 10"></div>
        <div style="--i: 11"></div>
      </div>
      <div class="loading-text">{{ label }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Chargement en cours...',
    },
  },
}
</script>
<style lang="scss">
/* Check for Houdini support & register property */
@supports (background: paint(something)) {
  @property --the-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
}

.loading {
  --n: 12; // nbre de petits cercles => correspond au nbre de DIV dans .loading
  --r: 3rem; // rayon du grand cercle
  --w: 0.5rem; // diamètre des petits cercles
  --theta: calc(360deg / var(--n)); // angle au centre entre 2 petits cercles
  --t: 1.5s; // durée animation

  display: grid;
  place-content: center;
  position: fixed;
  inset: 0;
  transform-origin: center;
  z-index: 9999;
  background: #444b;

  &-wrapper {
    display: grid;
    place-content: center;
    gap: 1rem;
  }

  &-anim {
    position: relative;
    width: calc(var(--w) + var(--r) * 2);
    aspect-ratio: 1;
    justify-self: center;
    display: grid;
    place-content: center;

    & > div {
      grid-area: 1/1;
      position: absolute;
      aspect-ratio: 1;
      width: var(--w);
      border-radius: 50%;
      background: #fff;
      left: calc(cos(var(--i) * var(--theta)) * var(--r) * -1);
      top: calc(sin(var(--i) * var(--theta)) * var(--r));
      translate: -50% -50%;
      opacity: calc(cos(var(--the-angle)) + 1);
      animation: dot var(--t) linear infinite;
      animation-delay: calc((var(--t) / var(--n)) * var(--i) * -1);
    }
  }

  &-text {
    font-weight: 600;
  }
}

@keyframes dot {
  to {
    --the-angle: 180deg;
  }
}
</style>
