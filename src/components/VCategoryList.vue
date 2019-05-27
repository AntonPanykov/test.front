<template>
  <div class="q-pa-lg">
    <p class="text-h6">{{ $i18n.t('headers.category') }}</p>
    <q-tree
      :nodes="items"
      node-key="id"
      selected-color="primary"
      label-key="title"
      :selected.sync="selected"
      default-expand-all
    />
  </div>
</template>

<script>
import { filter } from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'VCategoryList',
  data () {
    return {
      activeItem: false,
      items: [],
      selected: ''
    }
  },
  computed: {
    ...mapGetters('category', [
      'getCategories'
    ])
  },
  mounted () {
    this.createTree()
  },
  methods: {
    createTree () {
      this.items = Object.assign(this.getCategories)
      return new Promise(resolve => {
        let roots = this.getRoots()
        let activeIds = this.getActiveIds()
        roots.map(item => {
          this.getChildren(item, this.items, activeIds)
        })
        this.items = roots
        resolve()
      })
    },
    getActiveIds () {
      if (!this.activeItem) return false
      let path = this.pathToArray(this.activeItem.path)
      if (path.length === 1) return false
      path.pop()
      return path
    },
    getRoots () {
      return filter(this.items, item => {
        return item.path.split('.').length === 1
      })
    },
    pathToArray (path) {
      return path.split('.')
    },
    getChildren (item, items, activeIds) {
      // item.icon = !item.icon ? this.icon : item.icon
      // item.opened = activeIds && activeIds.indexOf(item.id.toString()) >= 0
      // item.selected = item.id === this.activeItem.id
      // item.loading = false
      const idIndex = item.path.split('.').length
      const idLength = idIndex + 1
      const children = filter(items, val => {
        const idArr = this.pathToArray(val.path)
        return idArr.length === idLength && idArr[idIndex - 1] === item.id
      })
      if (!children || !children.length) return
      item.children = children
      item.children.map(item => {
        this.getChildren(item, items, activeIds)
      })
    }
  }
}
</script>
