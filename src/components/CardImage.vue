<template>
  <figure class="card-image">
    <img :src="url" :alt="alt" :srcset="srcset" />
  </figure>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      //   type: String|Number,
    },
  },
  data() {
    return {
      isLoading: true,
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
        const formats = Object.getOwnPropertyNames(sizes);
        const infos = [];
    const srcset = [];
        let defaultWidth;
        let defaultURL;
        formats.forEach((format) => {
          infos.push({
            format: format,
            width: sizes[format].width,
            source_url: sizes[format].source_url,
          })
          if (format === 'medium') {
            defaultWidth = sizes[format].width;
            defaultURL = sizes[format].source_url;
          }
        })
        infos.sort((a, b) => a.width - b.width);
        infos.forEach((info) => {
            srcset.push(`${info.source_url} ${info.width}w`);
      });

        return {
            url: defaultURL,
            alt: data.alt_text,
            srcset: srcset,
            width: defaultWidth,
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l’image', error)
      }
    },
  },
  async created() {
    const infos =await this.fetchImgInfos();
    console.log(infos);
  },
}
</script>
<style lang="scss"></style>
