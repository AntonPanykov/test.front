<template>
  <q-breadcrumbs gutter="sm">
    <q-breadcrumbs-el label="Home" />
    <q-breadcrumbs-el
      v-for="category in chain"
      :key="category.id"
      :label="category.title" />
  </q-breadcrumbs>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VBreadcrumbs',
  data () {
    return {
      chain: []
    }
  },
  computed: {
    ...mapGetters('category', [
      'getCurrentCategory',
      'getCategoryById'
    ])
  },
  watch: {
    '$route' (to) {
      if (to.name === 'category') this.getChain()
    }
  },
  mounted () {
    if (this.$route.name === 'category') this.getChain()
  },
  methods: {
    getChain () {
      const currentCategory = this.getCurrentCategory
      if (!currentCategory) return false
      let tree = currentCategory.path.split('.')
      this.chain = tree.map(id => { return this.getCategoryById(id) })
    }
  }
}
</script>
