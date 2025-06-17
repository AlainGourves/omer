<script>
import CardImage from './CardImage.vue'

export default {
  components: {
    CardImage,
  },
  props: {
    recette: {
      id: {
        required: true,
        type: Number,
      },
      title: {
        required: true,
        type: String,
      },
      description: {
        required: true,
        type: String,
      },
      temps: {
        required: true,
        type: Number,
      },
      difficulte: {
        required: true,
        type: String,
      },
      categorie: {
        required: true,
        type: String,
      },
      imgId: {
        required: true,
        type: Number,
      },
    },
  },
  methods: {},
  computed: {},
  mounted() {},
}
</script>

<template>
  <article class="card" :id="recette.id">
    <card-image :id="recette.imgId"></card-image>
    <div class="card-content">
      <h2 class="card-title">{{ recette.title }}</h2>
      <p class="card-text">{{ recette.description }}</p>

      <div class="card-details">
        <p>
          <strong>Temps :</strong> <span>{{ recette.temps }} min</span>
        </p>
        <p>
          <strong>Difficulté :</strong> <span>{{ recette.difficulte }}</span>
        </p>
        <p>
          <strong>Catégorie :</strong> <span>{{ recette.categorie }}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.card {
  border: 1px solid #ccc;
  border-radius: 0.5em;
  padding: 1em;
  margin-block: 1em;
  min-width: 18em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
  &-image {
    img,
    svg {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 0.5em;
    }
  }
  &-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-block: 1em;
  }
  &-text {
    font-size: 1rem;
    margin-bottom: 1em;
  }
  &-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5em;

    p {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0 0.5em;
      padding: 0.25em;
      font-size: 0.8em;
      color: #444;
      background: #f2f2f2;
      border-radius: 0.5em;
    }
  }
}
</style>
