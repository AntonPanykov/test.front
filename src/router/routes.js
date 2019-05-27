import store from '../store'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    beforeEnter: (to, from, next) => {
      store.dispatch('category/loadCategories').finally(() => {
        next()
      })
    },
    children: [
      {
        path: '',
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
