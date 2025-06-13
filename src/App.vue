<script>
import SelectBase from './components/SelectBase.vue'
import RecetteCard from './components/RecetteCard.vue'

const baseURL = 'https://omer.zagzig.fr/'
const recettesURL = '/recettes.json'
const categoriesURL = '/categories.json'
const difficultesURL = '/difficultes.json'

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
            img: {
              id: obj.acf.image,
            },
          }
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes', error)
      }
    },

    async getImageInfos(imageId) {
      if (!imageId) return

      try {
        // récupère les informations sur l'image (obj JSON)
        const response = await fetch(`https://omer.zagzig.fr/wp-json/wp/v2/media/${imageId}`);
        const data = await response.json();
        let width = null;
        let url = null;
        const altText = data.alt_text || null;
        const sizes = data.media_details.sizes || null;
        if (!sizes) {
          throw new Error('Aucun format disponible pour cette image');
        }
        const formats = Object.getOwnPropertyNames(sizes);
        const srcset = this.makeSrcSet(sizes);
        formats.forEach((format) => {
          if (format === 'medium') {
            width = sizes[format].width || null
            url = sizes[format].source_url || null
          }
        })

        // return data.media_details
        return {
          altText: altText,
          width: width,
          url: url,
          srcset: srcset
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l’image', error)
      }
    },

    makeSrcSet(obj) {
      const infos = [];
      let srcset = [];
      const formats = Object.getOwnPropertyNames(obj);
      formats.forEach((format) => {
        infos.push({
          format: format,
          width: obj[format].width,
          source_url: obj[format].source_url,
        })
      });
      // Tri sur la largeur
      infos.sort((a, b) => a.width - b.width);
      infos.forEach((info) => {
        srcset.push(`${info.source_url} ${info.width}w`);
      });
      return srcset.join(',');
    },

    updateCategorie(value) {
      const categorie = this.categories.find((categorie) => categorie.id === value);
      this.selectedCategorie = categorie.name;
    },

    updateDifficulte(value) {
      const difficulte = this.difficultes.find((difficulte) => difficulte.id === value);
      this.selectedDifficulte = difficulte.name;
    },
  },
  async mounted() {
    // Catégories
    this.fetchCategories()
    // Difficultés
    this.fetchDifficultes()
    // Recettes
    await this.fetchRecettes()
    this.totalRecettes = this.recettes.length

    this.recettes.forEach(async (recette) => {
      const imgId = recette.img.id
      const imgInfos = await this.getImageInfos(imgId);
      if (!imgInfos) return
      recette.img.alt = imgInfos.altText
      recette.img.width = imgInfos.width
      recette.img.url = imgInfos.url
      recette.img.srcset = imgInfos.srcset
    })
  },
  computed: {
    filterRecettes() {
      let articles = this.recettes
      if (this.selectedCategorie) {
        articles = articles.filter(
          (recette) => recette.categorie === this.selectedCategorie,
        )
      }
      if (this.selectedDifficulte) {
        articles = articles.filter(
          (recette) => recette.difficulte === this.selectedDifficulte,
        )
      }
      console.log(articles);
      return articles;
    },
    totalRecettes() {
      return this.filterRecettes.length;
    },
  },
}
</script>

<template>
  <h1>Recettes</h1>
  <p class="total" v-if="totalRecettes > 0">{{ totalRecettes}} recette{{ totalRecettes > 1 ? 's' : '' }}</p>
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

  <recette-card  v-if="totalRecettes > 0" v-for="recette in filterRecettes" :key="recette.id" :recette="recette" />
  <p v-else>Aucune recette ne correspond à vos critères.</p>
</template>

<style lang="scss">
h1,
p.total,
.filtres {
  grid-column: 1/-1;
}

.filtres {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    background: #edbad6;
    padding: 1em;
    border-radius: 0.5em;
  }
}

.total{
    font-style: italic;
    background: deeppink;
}
</style>
