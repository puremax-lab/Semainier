import { recipeIngredients, recipeTitle } from './recipe.js'

// Builds the shopping list of a week from its planned recipes.

/** Lower case, single spaces, no accents: "Sel, poivre " and "sel, Poivre" are the same line. */
export function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/**
 * One line per ingredient, in the order the recipes are planned. The same line used by
 * several recipes appears once, with the recipes it is for. A recipe planned twice
 * counts once: quantities are free text in RecetteVie, so they are not added up.
 */
export function buildShoppingList(entries, lang = 'fr') {
  const lines = new Map()
  const seenRecipes = new Set()

  for (const { recipe } of entries) {
    if (seenRecipes.has(recipe.id)) continue
    seenRecipes.add(recipe.id)

    for (const ingredient of recipeIngredients(recipe, lang)) {
      const key = normalize(ingredient)
      if (!key) continue
      if (!lines.has(key)) lines.set(key, { key, text: ingredient.trim(), recipes: [] })
      lines.get(key).recipes.push(recipeTitle(recipe, lang))
    }
  }

  return [...lines.values()]
}
