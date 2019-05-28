<template>
  <q-page padding>
    <v-breadcrumbs/>
    <v-product-list/>
  </q-page>
</template>

<style>
</style>

<script>
import VProductList from '../components/Product/VProductList'
import VBreadcrumbs from '../components/VBreadcrumbs'
export default {
  name: 'PageIndex',
  components: { VBreadcrumbs, VProductList }
}
</script>
