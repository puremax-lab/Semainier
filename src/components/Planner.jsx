import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthError, fetchWeek, planMeal, removeMeal } from '../lib/api.js'
import { addDays, startOfWeek, toIsoDay, weekDays, weekLabel } from '../lib/dates.js'
import { buildShoppingList } from '../lib/shopping.js'
import MealSlot from './MealSlot.jsx'
import RecipePicker from './RecipePicker.jsx'
import ShoppingList from './ShoppingList.jsx'

const MEALS = [
  { key: 'lunch', label: 'Midi' },
  { key: 'dinner', label: 'Soir' },
]

/** `today` is only given by the tests, to show a fixed week. */
export default function Planner({ token, firstname, onLogout, today }) {
  const [monday, setMonday] = useState(() => startOfWeek(today ?? new Date()))
  const [entries, setEntries] = useState([])
  const [loadedWeek, setLoadedWeek] = useState(null) // the week whose entries are shown
  const [error, setError] = useState(false)
  const [picking, setPicking] = useState(null) // { day, meal, label } of the slot being filled

  const days = useMemo(() => weekDays(monday), [monday])
  const weekKey = toIsoDay(monday)
  const loading = loadedWeek !== weekKey

  const fail = useCallback((e) => {
    if (e instanceof AuthError) onLogout(e.message)
    else setError(true)
  }, [onLogout])

  useEffect(() => {
    let current = true
    fetchWeek(token, days[0].iso, days[6].iso)
      .then((week) => {
        if (!current) return
        setEntries(week)
        setLoadedWeek(toIsoDay(days[0].date))
        setError(false)
      })
      .catch((e) => current && fail(e))
    return () => { current = false }
  }, [token, days, fail])

  const bySlot = useMemo(() => new Map(entries.map((entry) => [`${entry.day}|${entry.meal}`, entry])), [entries])
  const shopping = useMemo(() => buildShoppingList(entries), [entries])

  async function choose(recipe) {
    const { day, meal } = picking
    setPicking(null)
    try {
      const entry = await planMeal(token, recipe.id, day, meal)
      setEntries((list) => [...list.filter((e) => !(e.day === day && e.meal === meal)), entry])
    } catch (error) {
      fail(error)
    }
  }

  async function remove(entry) {
    setEntries((list) => list.filter((e) => e.id !== entry.id))
    try {
      await removeMeal(token, entry.id)
    } catch (error) {
      setEntries((list) => [...list, entry])
      fail(error)
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <p className="brand">Semainier</p>
        <p className="account">
          {firstname ? `Bonjour ${firstname}` : 'Connecté'}
          <button type="button" className="link" onClick={() => onLogout()}>Se déconnecter</button>
        </p>
      </header>

      <main>
        <div className="week-head">
          <h1>Semaine <span>{weekLabel(monday)}</span></h1>
          <nav className="week-nav" aria-label="Changer de semaine">
            <button type="button" className="link" onClick={() => setMonday(addDays(monday, -7))} aria-label="Semaine précédente">← Précédente</button>
            <button type="button" className="link" onClick={() => setMonday(startOfWeek(new Date()))}>Cette semaine</button>
            <button type="button" className="link" onClick={() => setMonday(addDays(monday, 7))} aria-label="Semaine suivante">Suivante →</button>
          </nav>
        </div>

        {error && <p className="message message-error" role="alert">Impossible de joindre RecetteVie. Réessayez dans un instant.</p>}

        <section className={`week ${loading ? 'is-loading' : ''}`} aria-label={`Repas de la semaine ${weekLabel(monday)}`} aria-busy={loading}>
          {days.map((day) => (
            <div className="day" key={day.iso}>
              <h2 className="day-name">
                <span>{day.name}</span>
                <span className="day-number">{day.date.getDate()}</span>
              </h2>
              {MEALS.map((meal) => (
                <MealSlot
                  key={meal.key}
                  label={meal.label}
                  entry={bySlot.get(`${day.iso}|${meal.key}`)}
                  onAdd={() => setPicking({ day: day.iso, meal: meal.key, label: `${day.name} ${meal.label.toLowerCase()}` })}
                  onRemove={remove}
                />
              ))}
            </div>
          ))}
        </section>

        <ShoppingList key={weekKey} weekKey={weekKey} items={shopping} />
      </main>

      <footer className="footer">
        <p>Semainier · projet portfolio de puremax-lab · recettes et photos de <a href="https://puremax-lab.alwaysdata.net/recettevie">RecetteVie</a></p>
        <p>
          <a href="https://github.com/puremax-lab/Semainier">Code source</a>
          <a href="https://github.com/puremax-lab">GitHub puremax-lab</a>
          <a href="https://puremax-lab.alwaysdata.net/recettevie/mentions-legales">Mentions légales</a>
        </p>
      </footer>

      {picking && <RecipePicker slotLabel={picking.label} onChoose={choose} onClose={() => setPicking(null)} />}
    </div>
  )
}
