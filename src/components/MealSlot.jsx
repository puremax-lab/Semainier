import { useLanguage } from '../i18n/language.js'
import { imageUrl } from '../lib/api.js'
import { formatDuration } from '../lib/format.js'
import RecipeImage from './RecipeImage.jsx'
import { RECETTEVIE_URL } from '../lib/links.js'
import { recipeTitle } from '../lib/recipe.js'

export default function MealSlot({ label, entry, onAdd, onRemove }) {
  const { lang, t } = useLanguage()

  if (!entry) {
    return (
      <div className="slot slot-empty">
        <span className="slot-label">{label}</span>
        <button type="button" className="slot-add" onClick={onAdd}>{t('slot.add')}</button>
      </div>
    )
  }

  const { recipe } = entry
  const title = recipeTitle(recipe, lang)
  return (
    <article className="slot">
      <span className="slot-label">{label}</span>
      <RecipeImage src={imageUrl(recipe.imageName)} title={title} />
      <h3 className="slot-title">
        <a href={`${RECETTEVIE_URL}/recettes/${recipe.slug}-${recipe.id}`} target="_blank" rel="noopener">{title}</a>
      </h3>
      <p className="slot-meta">{formatDuration(recipe.duration, lang)}</p>
      <div className="slot-actions">
        <button type="button" className="link" onClick={onAdd}>{t('slot.change')}</button>
        <button type="button" className="link link-quiet" onClick={() => onRemove(entry)} aria-label={t('slot.removeLabel', { title })}>{t('slot.remove')}</button>
      </div>
    </article>
  )
}
