import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
const { createUploadLink } = require('apollo-upload-client')
import { Notify, LocalStorage, LoadingBar } from 'quasar'
import { i18nInstance } from 'boot/i18n'
import { ApolloLink, concat } from 'apollo-link'

const httpLink = createUploadLink({ uri: 'http://api.test.local/graphql' })
const httpLinkProject = createUploadLink({ uri: 'http://api.test.local/graphql/auth' })
const authMiddleware = new ApolloLink((operation, forward) => {
  LoadingBar.start()
  operation.setContext({
    headers: {
      authorization: LocalStorage.getItem('token') || null
    }
  })
  return forward(operation).map(response => {
    LoadingBar.stop()
    const context = operation.getContext()
    const { response: { headers } } = context
    if (headers) {
      const newToken = headers.get('authorization')
      if (newToken) LocalStorage.set('token', newToken)
    }
    return response
  })
})

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const AuthClient = new ApolloClient({
  link: concat(authMiddleware, httpLinkProject),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export const apolloProvider = new VueApollo({
  clients: {
    apolloClient,
    AuthClient
  },
  defaultClient: apolloClient,
  errorHandler ({ graphQLErrors, networkError }) {
    LoadingBar.stop()
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
      Notify.create(i18nInstance.t('errors.network'))
    }
  }
})

export default async ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
