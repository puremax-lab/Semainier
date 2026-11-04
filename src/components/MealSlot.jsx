import { imageUrl } from '../lib/api.js'
import { formatDuration } from '../lib/format.js'
import RecipeImage from './RecipeImage.jsx'
import { RECETTEVIE_URL } from '../lib/links.js'

export default function MealSlot({ label, entry, onAdd, onRemove }) {
  if (!entry) {
    return (
      <div className="slot slot-empty">
        <span className="slot-label">{label}</span>
        <button type="button" className="slot-add" onClick={onAdd}>+ Choisir une recette</button>
      </div>
    )
  }

  const { recipe } = entry
  return (
    <article className="slot">
      <span className="slot-label">{label}</span>
      <RecipeImage src={imageUrl(recipe.imageName)} title={recipe.title} />
      <h3 className="slot-title">
        <a href={`${RECETTEVIE_URL}/recettes/${recipe.slug}-${recipe.id}`} target="_blank" rel="noopener">{recipe.title}</a>
      </h3>
      <p className="slot-meta">{formatDuration(recipe.duration)}</p>
      <div className="slot-actions">
        <button type="button" className="link" onClick={onAdd}>Changer</button>
        <button type="button" className="link link-quiet" onClick={() => onRemove(entry)} aria-label={`Retirer ${recipe.title}`}>Retirer</button>
      </div>
    </article>
  )
}
