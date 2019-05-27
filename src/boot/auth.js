function isArrayOrString (variable) {
  return (typeof variable === typeof [] || typeof variable === typeof '')
}

export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    const record = to.matched.find(record => record.meta.auth)
    if (record) {
      const roles = to.meta.roles
      if (!store.getters['auth/loggedIn']) {
        store.dispatch('auth/fetch').then(() => {
          if (roles) {
            if (!store.getters['auth/check'](roles)) router.push('/404')
          }
          next()
        }).catch(err => {
          console.error(err)
          router.push('/login')
          next()
        })
      } else if (isArrayOrString(record.meta.auth) && !store.getters['auth/check'](record.meta.auth)) {
        if (roles) {
          if (!store.getters['auth/check'](roles)) router.push('/404')
        }
        next()
      } else {
        next()
      }
    } else {
      next()
    }
  })

  let helper = {}
  helper.loggedIn = () => { return store.getters['auth/loggedIn'] }
  helper.check = (roles) => { return store.getters['auth/check'](roles) }
  helper.login = (data) => { return store.dispatch('auth/login', data) }
  helper.logout = () => { return store.dispatch('auth/logout') }
  helper.verify = (token) => { return store.dispatch('auth/verify', token) }
  helper.fetch = () => { return store.dispatch('auth/fetch') }
  helper.user = () => { return store.getters['auth/user'] }
  Vue.prototype.$auth = helper
}
