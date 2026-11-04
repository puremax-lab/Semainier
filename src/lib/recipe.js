import { CATEGORIES_EN } from '../i18n/messages.js'

// Recipes come from the API in both languages. French is used when the English text is missing.

export function recipeTitle(recipe, lang) {
  return (lang === 'en' && recipe.titleEn) || recipe.title
}

export function recipeIngredients(recipe, lang) {
  return lang === 'en' && recipe.ingredientsEn?.length ? recipe.ingredientsEn : recipe.ingredients
}

export function categoryName(category, lang) {
  return (lang === 'en' && CATEGORIES_EN[category?.slug]) || category?.name
}
