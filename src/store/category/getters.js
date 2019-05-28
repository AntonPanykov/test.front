export function getCategories (state) {
  return state.categories
}

export function getCurrentCategory (state) {
  return state.currentCategory || null
}

export const getCategoryById = state => id => {
  return state.categories.find(item => { return parseInt(item.id) === parseInt(id) })
}

export const getCategoryBySlug = state => slug => {
  // Ищу по названию чтобы не заморачиваться с красивым slug, т.к. в url использую title (по тем же соображениям)
  return state.categories.find(item => { return item.title === slug })
}
