<script>
import SelectBase from './components/SelectBase.vue'
import RecetteCard from './components/RecetteCard.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

const baseURL = 'https://omer.zagzig.fr/wp-json/wp/v2'
const recettesURL = '/recette'
const categoriesURL = '/categorie'
const difficultesURL = '/difficulte'

export default {
  name: 'App',
  components: {
    SelectBase,
    RecetteCard,
    LoadingSpinner,
  },
  data() {
    return {
      loading: true,
      categories: [],
      difficultes: [],
      tri: [
        { id: 'asc', name: 'Temps croissant' },
        { id: 'desc', name: 'Temps décroissant' },
      ],
      recettes: [],
      sortDir: null,
      selectedCategorie: null,
      selectedDifficulte: null,
      articlesTotal: 0,
      articlesPerPage: 4,
      articleIndex: 0,
      articleToScrollTo: null,
      totalPages: 0,
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch(`${baseURL}${categoriesURL}`)
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
        const response = await fetch(`${baseURL}${difficultesURL}`)
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

    async fetchArticles() {
      try {
        const categoryFilter = this.selectedCategorie ? `&categorie=${this.selectedCategorie}` : ''
        const difficulteFilter = this.selectedDifficulte
          ? `&difficulte=${this.selectedDifficulte}`
          : ''
        const query = `${baseURL}${recettesURL}?${categoryFilter}${difficulteFilter}&per_page=${this.articlesPerPage}&offset=${this.articleIndex}`
        const response = await fetch(query)
        this.articlesTotal = response.headers.get('X-WP-Total')
        const data = await response.json()
        this.articleIndex += data.length

        const newArticles = data.map((obj, idx) => {
          const categorie = this.categories.find((categorie) => categorie.id === obj.acf.categorie)
          const difficulte = this.difficultes.find(
            (difficulte) => difficulte.id === obj.acf.difficulte[0],
          )
          if (idx === 0) this.articleToScrollTo = obj.id
          return {
            id: obj.id,
            title: obj.acf.Nom,
            description: obj.acf.description,
            categorie: categorie.name,
            difficulte: difficulte.name,
            temps: obj.acf.temps,
            imgId: obj.acf.image,
          }
        })
        this.recettes = this.recettes.concat([...newArticles])
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('Erreur lors de la récupération des articles', error)
      }
    },

    updateSortDirection(value) {
      if (value === 'all') {
        this.sortDir = null
      } else {
        this.sortDir = value
      }
    },

    updateCategorie(value) {
      this.selectedCategorie = value === 'all' ? null : value
      this.recettes = []
      this.articleIndex = 0
      this.loadArticles()
    },

    updateDifficulte(value) {
      this.selectedDifficulte = value === 'all' ? null : value
      this.recettes = []
      this.articleIndex = 0
      this.loadArticles()
    },

    async loadArticles() {
      this.loading = true
      await this.fetchArticles()
      this.scrollHandler()
    },

    scrollHandler() {
      const scrollTarget = document.getElementById(this.articleToScrollTo)
      scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
  },
  async mounted() {
    // Catégories
    await this.fetchCategories()
    // Difficultés
    await this.fetchDifficultes()
    // Recettes
    await this.loadArticles()
  },
  computed: {
    sortArticles() {
      let articles = [...this.recettes]
      if (this.sortDir) {
        if (this.sortDir === 'asc') {
          articles.sort((a, b) => (a.temps || 0) - (b.temps || 0))
        } else if (this.sortDir === 'desc') {
          articles.sort((a, b) => (b.temps || 0) - (a.temps || 0))
        }
      }
      return articles
    },
    nbrArticles() {
      return this.sortArticles.length
    },
  },
}
</script>

<template>
  <h1>Recettes</h1>
  <template v-if="loading">
    <loading-spinner label="Chargement des recettes..." />
  </template>
  <div class="filtres">
    <select-base
      name="temps"
      label="Trier par temps"
      fn="sort"
      default="Par défaut"
      :options="tri"
      :loading="loading"
      @sort-temps="updateSortDirection"
    />
    <select-base
      name="categorie"
      label="Filtrer par catégorie"
      fn="filter"
      default="Toutes les catégories"
      :options="categories"
      :loading="loading"
      @filter-categorie="updateCategorie"
    />
    <select-base
      name="difficulte"
      label="Filtrer par difficulté"
      fn="filter"
      default="Toutes les difficultés"
      :options="difficultes"
      :loading="loading"
      @filter-difficulte="updateDifficulte"
    />
  </div>
  <div class="content">
    <recette-card
    v-if="nbrArticles > 0"
    v-for="recette in sortArticles"
    :key="recette.id"
    :ref="recette.id === this.articleToScrollTo ? 'scrollTarget' : null"
    :recette="recette"
    />
    <template v-else>
      <p v-if="!loading">Aucune recette ne correspond à vos critères.</p>
    </template>
  </div>

  <div v-if="!loading && articleIndex < articlesTotal" class="load-more_wrap">
    <button @click="loadArticles">Charger plus ({{ (articlesTotal - nbrArticles) }} supplémentaire{{ (articlesTotal - nbrArticles) > 1 ? 's' : '' }})</button>
  </div>
</template>

<style lang="scss">
.content{
display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .content {
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}

.filtres {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  container-type: inline-size;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
    background: #edbad6;
    padding: .5em;
    border-radius: 0.5em;
  }

  @container (max-width: 1180px) {
    div{
      flex-direction: column;
    }
  }
}

@media screen and (max-width: 730px) {
  .filtres {
    grid-template-columns: 1fr;
  }
}

.load-more_wrap {
  display: flex;
  justify-content: center;
  margin-block-end: 3em;

  & button {
    background-color: transparent;
    border: 1px solid #c36;
    border-radius: 0.5em;
    color: #c36;
    display: inline-block;
    font-size: 1rem;
    font-weight: 400;
    padding: 0.5rem 1.25rem;
    user-select: none;
    white-space: nowrap;
  }
}
</style>
