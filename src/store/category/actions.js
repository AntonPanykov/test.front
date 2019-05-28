import { apolloProvider } from 'boot/apollo'
import LOAD_CATEGORY_QUERY from '../../graphql/queries/loadCategories.gql'

export function loadCategories (state) {
  return apolloProvider.defaultClient.query({
    query: LOAD_CATEGORY_QUERY
  }).then(({ data }) => {
    state.commit('setCategory', data.loadCategories)
  })
}
