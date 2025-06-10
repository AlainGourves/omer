<template>
  <article class="card" :id="recette.id">
    <div class="card-image">
      <img src="" alt="" />
    </div>
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
        <p>
          <strong>Image :</strong> <span>{{ recette.imgId }}</span>
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
        imgId: {
            required: true,
            type: Number,
        },
    }
  },
  methods: {},
  computed: {},
  mounted() {
  },
}
</script>
<style lang=""></style>
