<template>
  <figure class="card-image">
    <svg v-if="loading" viewBox="0 0 100 80.64" xmlns="http://www.w3.org/2000/svg">
      <g fill="#555">
        <path
          d="m90.22 26.22-6.81-25.4-82.41 22.08 12.68 47.33v9.62h85.32v-53.63zm-76.54 20.64-5.43-20.28 70.63-18.93 4.98 18.57h-70.18zm79.18-10.78v38.31h-73.13v-42.74h73.13v4.44z"
        />
        <path d="m23.9 71.3h64.62l-33.5-24.05-4.69 6.85-12.4-10.84-14.03 19.59z" />
        <circle cx="72.81" cy="44.04" r="6.5" />
      </g>
    </svg>
    
    <img v-else :src="url" :alt="alt" :srcset="srcset" />
  </figure>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      url: null,
      alt: null,
      srcset: null,
      width: null,
      loading: true,
      error: null,
    }
  },
  methods: {
    async fetchImgInfos() {
      try {
        const response = await fetch(`https://omer.zagzig.fr/wp-json/wp/v2/media/${this.id}`)
        const data = await response.json()
        const sizes = data.media_details.sizes || null
        if (!sizes) {
          throw new Error('Aucun format disponible pour cette image')
        }
        const formats = Object.getOwnPropertyNames(sizes)
        const infos = []
        const srcset = []
        let defaultWidth
        let defaultURL
        formats.forEach((format) => {
          // infos.push({
          //   format: format,
          //   width: sizes[format].width,
          //   source_url: sizes[format].source_url,
          // })
          if (format === 'medium') {
            defaultWidth = sizes[format].width
            defaultURL = sizes[format].source_url
          }
        })
        // infos.sort((a, b) => a.width - b.width)
        // infos.forEach((info) => {
        //   srcset.push(`${info.source_url} ${info.width}w`)
        // })

        this.loading = false
        return {
          url: defaultURL,
          alt: data.alt_text,
          srcset: srcset,
          width: defaultWidth,
        }
      } catch (error) {
        this.loading = false
        console.error('Erreur lors de la récupération de l’image', error)
      }
    },
  },
  async created() {
    const infos = await this.fetchImgInfos()
    this.url = infos.url
    this.alt = infos.alt
  },
}
</script>
<style lang="scss"></style>
