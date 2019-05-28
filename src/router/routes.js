import store from '../store'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    beforeEnter: (to, from, next) => {
      console.log(to)
      store.dispatch('category/loadCategories').then(() => {
        if (to.name === 'category') store.commit('category/setCurrentCategory', store.getters['category/getCategoryBySlug'](to.params.slug))
      }).finally(() => {
        next()
      })
    },
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'category/:slug',
        name: 'category',
        component: () => import('pages/Index.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
