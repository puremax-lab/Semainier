import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/language.js'
import { fetchRecipes, imageUrl } from '../lib/api.js'
import { formatDuration } from '../lib/format.js'
import { categoryName, recipeTitle } from '../lib/recipe.js'
import RecipeImage from './RecipeImage.jsx'

/**
 * Side panel to pick a recipe for a slot. The list loads the next page by itself when its end
 * scrolls into view; the "Load more" button does the same by hand.
 */
export default function RecipePicker({ slotLabel, onChoose, onClose }) {
  const { lang, t } = useLanguage()
  const dialog = useRef(null)
  const sentinel = useRef(null)
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [recipes, setRecipes] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loaded, setLoaded] = useState(null) // "search|page" of the last answer, ok or not
  const [error, setError] = useState(false)
  const loading = loaded !== `${search}|${page}`
  const hasMore = recipes.length < total

  useEffect(() => {
    const element = dialog.current
    // showModal() traps the focus in the panel; older browsers (and jsdom) only get the open attribute.
    if (element && !element.open) {
      if (typeof element.showModal === 'function') element.showModal()
      else element.setAttribute('open', '')
    }
    return () => element?.open && element.close?.()
  }, [])

  // Waits for a short pause in typing, then searches from the first page.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let current = true
    fetchRecipes({ page, title: search, lang })
      .then((result) => {
        if (!current) return
        setRecipes((list) => (page === 1 ? result.recipes : [...list, ...result.recipes]))
        setTotal(result.total)
        setError(false)
      })
      .catch(() => current && setError(true))
      .finally(() => current && setLoaded(`${search}|${page}`))
    return () => { current = false }
  }, [page, search, lang])

  useEffect(() => {
    if (!hasMore || loading || !sentinel.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setPage((p) => p + 1), { rootMargin: '200px' })
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [hasMore, loading])

  return (
    <dialog ref={dialog} className="picker" aria-labelledby="picker-title" onCancel={(e) => { e.preventDefault(); onClose() }}>
      <div className="picker-head">
        <p className="kicker">{slotLabel}</p>
        <h2 id="picker-title">{t('picker.title')}</h2>
        <button type="button" className="link picker-close" onClick={onClose}>{t('picker.close')}</button>
      </div>

      <label className="visually-hidden" htmlFor="recipe-search">{t('picker.search')}</label>
      <input id="recipe-search" type="search" className="picker-search" placeholder={t('picker.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />

      {error && <p className="message message-error" role="alert">{t('errors.recipes')}</p>}
      {!loading && !error && recipes.length === 0 && <p className="muted">{t('picker.empty', { search })}</p>}

      <ul className="picker-list">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <button type="button" className="picker-item" onClick={() => onChoose(recipe)}>
              <RecipeImage src={imageUrl(recipe.imageName)} title={recipeTitle(recipe, lang)} className="picker-thumb" />
              <span>
                <span className="picker-title">{recipeTitle(recipe, lang)}</span>
                <span className="picker-meta">{categoryName(recipe.category, lang)} · {formatDuration(recipe.duration, lang)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={sentinel} className="picker-more">
          <button type="button" className="link" onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? t('picker.loading') : t('picker.more')}
          </button>
        </div>
      )}
      {loading && !hasMore && <p className="muted" role="status">{t('picker.loading')}</p>}
    </dialog>
  )
}
