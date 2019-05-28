<template>
  <div>
    <q-spinner
      v-if="$apollo.queries.loadProducts.loading"
      color="primary"
      size="3em"
    />
    <div v-if="loadProducts && loadProducts.data.length" class="q-pa-md row items-start q-gutter-md">
      <q-card class="card" v-for="product in products" :key="product.id">
        <img :src="product.img">
        <q-card-section>
          <div class="text-h6">{{ product.title }}</div>
          <div class="text-subtitle2">Категория: {{ product.category.title }}</div>
        </q-card-section>

        <q-card-section>
          {{ product.description }}
        </q-card-section>
      </q-card>
      <q-btn
        v-show="isShowLoadBtn"
        class="full-width"
        color="white"
        text-color="black"
        :loading="$apollo.queries.loadProducts.loading"
        :label="$i18n.t('buttons.load')"
        @click="loadMore"/>
    </div>
    <div v-else-if="!$apollo.queries.loadProducts.loading">
      <p>Ничего не найдено</p>
    </div>
  </div>
</template>

<script>
import LOAD_PRODUCTS from 'gql/queries/loadProducts.gql'
import { mapGetters } from 'vuex'

export default {
  name: 'VProductList',
  data () {
    return {
      products: [],
      loading: false,
      page: 1
    }
  },
  apollo: {
    loadProducts: {
      query: LOAD_PRODUCTS,
      fetchPolicy: 'network-only',
      variables () {
        return {
          categoryId: this.getCurrentCategory ? this.getCurrentCategory.id : null,
          page: 1
        }
      },
      result ({ data }) {
        this.products = data.loadProducts.data
      }
    }
  },
  computed: {
    ...mapGetters('category', [
      'getCurrentCategory'
    ]),
    isShowLoadBtn () {
      return this.loadProducts.total - (this.page * this.loadProducts.per_page) > 0
    }
  },
  watch: {
    getCurrentCategory () {
      this.page = 1
    }
  },
  methods: {
    loadMore () {
      this.page++
      this.$apollo.queries.loadProducts.fetchMore({
        variables: {
          page: this.page,
          categoryId: this.getCurrentCategory ? this.getCurrentCategory.id : null
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newProduct = fetchMoreResult.loadProducts.data
          console.log(previousResult.loadProducts)
          return {
            loadProducts: {
              __typename: previousResult.loadProducts.__typename,
              data: [...previousResult.loadProducts.data, ...newProduct],
              per_page: fetchMoreResult.loadProducts.per_page,
              total: fetchMoreResult.loadProducts.total
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card{
    width: 100%;
    max-width: 250px;
  }
</style>
