import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/language.js'

// Ticked lines are remembered per week in this browser only.
const storageKey = (weekKey) => `semainier.checked.${weekKey}`

function loadChecked(weekKey) {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey(weekKey)) ?? '[]'))
  } catch {
    return new Set()
  }
}

export default function ShoppingList({ weekKey, items }) {
  const { t } = useLanguage()
  const [checked, setChecked] = useState(() => loadChecked(weekKey))

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(weekKey), JSON.stringify([...checked]))
    } catch {
      // Not saved, but the list still works for this visit.
    }
  }, [weekKey, checked])

  function toggle(key) {
    setChecked((set) => {
      const next = new Set(set)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const remaining = items.filter((item) => !checked.has(item.key)).length

  return (
    <section className="shopping" aria-labelledby="shopping-title">
      <div className="shopping-head">
        <h2 id="shopping-title">{t('shopping.title')}</h2>
        {items.length > 0 && <p className="muted">{remaining === 0 ? t('shopping.done') : t('shopping.remaining', { remaining, total: items.length })}</p>}
      </div>

      {items.length === 0
        ? <p className="muted">{t('shopping.empty')}</p>
        : (
          <ul className="shopping-list">
            {items.map((item) => (
              <li key={item.key} className={checked.has(item.key) ? 'is-checked' : ''}>
                <label>
                  <input type="checkbox" checked={checked.has(item.key)} onChange={() => toggle(item.key)} />
                  <span className="shopping-text">{item.text}</span>
                  <span className="shopping-for">{item.recipes.join(', ')}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}
