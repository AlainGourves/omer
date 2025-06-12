<template>
  <article class="card" :id="recette.id">
    <figure class="card-image">
      <img :src="recette.img.url" :alt="recette.img.alt" />
    </figure>
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
<script>
export default {
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
        img: {
          id: {
            required: true,
            type: Number,
          },
          url: {
            type: String,
          },
          alt: {
            type: String,
          },
          width:{
            type: Number,
          }
        },
    }
  },
  methods: {},
  computed: {},
  mounted() {
  },
}
</script>
<style lang="scss">
.card{
  border: 1px solid #ccc;
  border-radius: .5em;
  padding: 1em;
  margin-block: 1em;
  min-width: 18em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
  &-image{
    img{
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: .5em;
      background: rebeccapurple;
    }
  }
  &-title{
    font-size: 1.5rem;
    font-weight: 600;
    margin-block: 1em;
  }
  &-text{
    font-size: 1rem;
    margin-bottom: 1em;
  }
  &-details{
    p{
      margin: 0;
      padding: 0;
      font-size: 0.8em;
      color: #666;
    }
  }
}
</style>
