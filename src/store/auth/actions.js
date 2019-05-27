import { apolloProvider as apollo } from 'boot/apollo'
import { LocalStorage, SessionStorage } from 'quasar'

const LOGIN_ROUTE = '/auth/login'
const USER_ROUTE = '/auth/user'
const REFRESH_TOKEN = '/auth/refresh'
const LOGOUT_ROUTE = '/auth/logout'

export function login (state, data) {
  return apollo.post(LOGIN_ROUTE, data).then((response) => {
    const token = response.data.token
    apollo.defaults.headers.common['Authorization'] = token
    LocalStorage.set('token', token)
    state.dispatch('fetch')
  })
}

export function refresh (state) {
  return apollo.get(REFRESH_TOKEN).then((response) => {
    LocalStorage.set('token', response.data.token)
  }).catch(() => {
    state.dispatch('logout')
  })
}

export function fetch (state) {
  return apollo.get(USER_ROUTE).then((response) => {
    state.commit('setUser', response.data)
  })
}

export function logout (state) {
  return apollo.post(LOGOUT_ROUTE).then(() => {
    if (LocalStorage.has('token')) {
      LocalStorage.remove('token')
    } else if (SessionStorage.has('token')) {
      SessionStorage.remove('token')
    }
    state.commit('setUser', null)
  })
}

export function verify (state, token) {
  return apollo.get('/auth/verify/' + token)
}

// TODO: Переписать под аполло
