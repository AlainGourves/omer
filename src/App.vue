<script>
import SelectBase from './components/SelectBase.vue';
import RecetteCard from './components/RecetteCard.vue';
import CompteRecettes from './components/CompteRecettes.vue';

const baseURL = 'https://omer.zagzig.fr/';
const recettesURL = '/recettes.json';
const categoriesURL = '/categories.json';
const difficultesURL = '/difficultes.json';

export default {
  name: 'App',
  components: {
    SelectBase,
    RecetteCard,
    CompteRecettes
  },
  data() {
    return {
      categories: [],
      difficultes: [],
      recettes: [],
      selectedCategorie: null,
      selectedDifficulte: null,
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

    updateCategorie(value) {
      console.log('updateCategorie', value);
    },

    updateDifficulte(value) {
      console.log('updateDifficulte', value);
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
    })
  },
  computed: {},
}
</script>

<template>
  <h1>Recettes</h1>
  <compte-recettes v-if="totalRecettes > 0" :total="totalRecettes" />
  <div class="filtres">
    <select-base
      name="categorie"
      label="Filtrer par catégorie :"
      default="Toutes les catégories"
      :options="categories"
      @filter-categorie="updateCategorie"
    />
    <select-base
      name="difficulte"
      label="Filtrer par difficulté :"
      default="Toutes les difficultés"
      :options="difficultes"
      @filter-difficulte="updateDifficulte"
    />
  </div>

  <recette-card v-for="recette in recettes" :key="recette.id" :recette="recette" />
</template>

<style lang="scss">
h1,
.filtres {
  grid-column: 1/-1;
}

.filtres {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  &>div{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5em;
    background: #edbad6;
    padding: 1em;
    border-radius: .5em;
  }
}
</style>
