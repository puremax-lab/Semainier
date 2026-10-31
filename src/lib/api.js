// Calls to the RecetteVie API. Online, both apps share the same domain:
// VITE_RECETTEVIE_PATH is the folder RecetteVie is served from ("/recettevie"), empty in development.

const ROOT = import.meta.env.VITE_RECETTEVIE_PATH ?? ''

export class AuthError extends Error {}

export function imageUrl(imageName) {
  return imageName ? `${ROOT}/uploads/recipes/${encodeURIComponent(imageName)}` : null
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/ld+json' }
  if (body !== undefined) headers['Content-Type'] = 'application/ld+json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${ROOT}/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401) throw new AuthError('Session expirée, reconnectez-vous.')
  if (!response.ok) throw new Error(`L'API a répondu ${response.status}.`)
  return response.status === 204 ? null : response.json()
}

/** Returns the JWT, or throws AuthError when the email or password is wrong. */
export async function login(email, password) {
  const response = await fetch(`${ROOT}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (response.status === 401) throw new AuthError('Email ou mot de passe incorrect.')
  if (!response.ok) throw new Error(`L'API a répondu ${response.status}.`)
  return (await response.json()).token
}

/** One page of recipes (12 per page), with the total to know whether more pages follow. */
export async function fetchRecipes({ page = 1, title = '', category = '' } = {}) {
  const params = new URLSearchParams({ page })
  if (title) params.set('title', title)
  if (category) params.set('category.slug', category)
  const data = await request(`/recipes?${params}`)
  return { recipes: data.member, total: data.totalItems }
}

export async function fetchWeek(token, firstDay, lastDay) {
  const params = new URLSearchParams({ 'day[after]': firstDay, 'day[before]': lastDay })
  return (await request(`/meal_plan_entries?${params}`, { token })).member
}

/** Plans a recipe; the API replaces the recipe already planned in that slot. */
export function planMeal(token, recipeId, day, meal) {
  return request('/meal_plan_entries', { method: 'POST', token, body: { recipe: `/api/recipes/${recipeId}`, day, meal } })
}

export function removeMeal(token, entryId) {
  return request(`/meal_plan_entries/${entryId}`, { method: 'DELETE', token })
}
