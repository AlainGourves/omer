<script>
import SelectBase from './components/SelectBase.vue'
import RecetteCard from './components/RecetteCard.vue'

const baseURL = 'https://omer.zagzig.fr/';
const recettesURL = '/recettes.json';
const categoriesURL = '/categories.json';
const difficultesURL = '/difficultes.json';

export default {
  name: 'App',
  components: {
    SelectBase,
    RecetteCard,
  },
  data() {
    return {
      categories: [],
      difficultes: [],
      recettes: [],
      totalRecettes: 0,
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch(categoriesURL)
        const data = await response.json()
        this.categories = data.map((obj) => {
          return {
            id: obj.id,
            name: obj.name,
          }
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error)
      }
    },

    async fetchDifficultes() {
      try {
        const response = await fetch(difficultesURL)
        const data = await response.json()
        this.difficultes = data.map((obj) => {
          return {
            id: obj.id,
            name: obj.name,
          }
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des difficultés', error)
      }
    },

    async fetchRecettes() {
      try {
        const response = await fetch(recettesURL)
        const data = await response.json()
        this.recettes = data.map((obj) => {
          const categorie = this.categories.find((categorie) => categorie.id === obj.acf.categorie)
          const difficulte = this.difficultes.find(
            (difficulte) => difficulte.id === obj.acf.difficulte[0],
          )
          return {
            id: obj.id,
            title: obj.acf.nom,
            description: obj.acf.description,
            categorie: categorie.name,
            difficulte: difficulte.name,
            temps: obj.acf.temps,
            img:{
              id: obj.acf.image,
            }
          }
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes', error)
      }
    },

    async getImageInfos(imageId) {
      if (!imageId) return

      try {
        const response = await fetch(`https://omer.zagzig.fr/wp-json/wp/v2/media/${imageId}`)
        const data = await response.json()
        const altText = data.alt_text || null;
        const sizes = data.media_details.sizes;
        const formats = Object.getOwnPropertyNames(sizes);
        let width = null;
        let url = null;
        formats.forEach((format) => {
          if (format === 'medium') {
            width = sizes[format].width || null;
            url = sizes[format].source_url || null;
          }
        })

        // return data.media_details
        return {
          altText: altText,
          width: width,
          url: url,
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l’image', error)
      }
    },
  },
  async mounted() {
    // Catégories
    this.fetchCategories();
    // Difficultés
    this.fetchDifficultes();
    // Recettes
    await this.fetchRecettes();
    this.totalRecettes = this.recettes.length;

    this.recettes.forEach(async (recette) => {
      const imgId = recette.img.id
      const imgInfos = await this.getImageInfos(imgId);
      recette.img.alt = imgInfos.altText;
      recette.img.width = imgInfos.width;
      recette.img.url = imgInfos.url;
      console.log(`${imgInfos.url}`)
    })
  },
  computed: {},
}
</script>

<template>
  <h1>Recettes</h1>
  <select-base
    name="categories"
    label="Filtrer par catégorie :"
    default="Toutes les catégories"
    :options="categories"
  />
  <select-base
    name="difficulte"
    label="Filtrer par difficulté :"
    default="Toutes les difficultés"
    :options="difficultes"
  />

  <recette-card v-for="recette in recettes" :key="recette.id" :recette="recette" />
</template>

<style scoped></style>
