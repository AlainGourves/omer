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
        const response = await fetch(
          `${baseURL}${recettesURL}?&per_page=${this.articlesPerPage}&offset=${this.articleIndex}`,
        )
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
      if (value === 'all') {
        this.selectedCategorie = null
      } else {
        const categorie = this.categories.find((categorie) => categorie.id === value)
        this.selectedCategorie = categorie.name
      }
    },

    updateDifficulte(value) {
      if (value === 'all') {
        this.selectedDifficulte = null
      } else {
        const difficulte = this.difficultes.find((difficulte) => difficulte.id === value)
        this.selectedDifficulte = difficulte.name
      }
    },

    async loadMoreArticles() {
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
    await this.fetchArticles()
    this.scrollHandler()
  },
  computed: {
    filterRecettes() {
      let articles = [...this.recettes]
      if (this.sortDir) {
        if (this.sortDir === 'asc') {
          articles.sort((a, b) => (a.temps || 0) - (b.temps || 0))
        } else if (this.sortDir === 'desc') {
          articles.sort((a, b) => (b.temps || 0) - (a.temps || 0))
        }
      }
      if (this.selectedCategorie) {
        articles = articles.filter((recette) => recette.categorie === this.selectedCategorie)
      }
      if (this.selectedDifficulte) {
        articles = articles.filter((recette) => recette.difficulte === this.selectedDifficulte)
      }
      return articles
    },
    nbrArticles() {
      return this.filterRecettes.length
    },
  },
}
</script>

<template>
  <h1>Recettes</h1>
  <template v-if="loading">
    <loading-spinner label="Chargement des recettes..." />
  </template>
  <p class="total" v-if="nbrArticles > 0">
    {{ nbrArticles }} recette{{ nbrArticles > 1 ? 's' : '' }} / {{ articlesTotal }}
  </p>
  <div class="filtres">
    <select-base
      name="temps"
      label="Trier par temps"
      func="sort"
      default="Par défaut"
      :options="tri"
      @sort-temps="updateSortDirection"
    />
    <select-base
      name="categorie"
      label="Filtrer par catégorie"
      func="filter"
      default="Toutes les catégories"
      :options="categories"
      @filter-categorie="updateCategorie"
    />
    <select-base
      name="difficulte"
      label="Filtrer par difficulté"
      func="filter"
      default="Toutes les difficultés"
      :options="difficultes"
      @filter-difficulte="updateDifficulte"
    />
  </div>

  <recette-card
    v-if="nbrArticles > 0"
    v-for="recette in filterRecettes"
    :key="recette.id"
    :ref="recette.id === this.articleToScrollTo ? 'scrollTarget' : null"
    :recette="recette"
  />
  <template v-else>
    <p v-if="!loading">Aucune recette ne correspond à vos critères.</p>
  </template>

  <div v-if="!loading && articleIndex < articlesTotal" class="load-more_wrap">
    <button @click="loadMoreArticles">Charger plus</button>
  </div>
</template>

<style lang="scss">
h1,
p.total,
.filtres,
.load-more_wrap {
  grid-column: 1/-1;
}

.filtres {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.total {
  padding-inline: 0.5em;
  border-radius: 0.5em;
  font-style: italic;
  background: #f2f2f2;
}

.load-more_wrap {
  display: flex;
  justify-content: center;
  margin-block-end: 2em;

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
