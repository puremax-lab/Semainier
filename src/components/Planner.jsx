import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/language.js'
import { AuthError, fetchWeek, planMeal, removeMeal } from '../lib/api.js'
import { addDays, startOfWeek, toIsoDay, weekDays, weekLabel } from '../lib/dates.js'
import { buildShoppingList } from '../lib/shopping.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import MealSlot from './MealSlot.jsx'
import RecipePicker from './RecipePicker.jsx'
import ShoppingList from './ShoppingList.jsx'
import { RECETTEVIE_URL } from '../lib/links.js'

const MEALS = ['lunch', 'dinner']

/** `today` is only given by the tests, to show a fixed week. */
export default function Planner({ token, firstname, onLogout, today }) {
  const { lang, t } = useLanguage()
  const [monday, setMonday] = useState(() => startOfWeek(today ?? new Date()))
  const [entries, setEntries] = useState([])
  const [loadedWeek, setLoadedWeek] = useState(null) // the week whose entries are shown
  const [error, setError] = useState(false)
  const [picking, setPicking] = useState(null) // { day, meal, dayIndex } of the slot being filled

  const days = useMemo(() => weekDays(monday), [monday])
  const dayNames = weekDays(monday, lang).map((day) => day.name)
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
  const shopping = useMemo(() => buildShoppingList(entries, lang), [entries, lang])

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
        <div className="masthead-start">
          <p className="brand">Semainier</p>
          <a className="back-link" href={RECETTEVIE_URL}>{t('header.allRecipes')}</a>
        </div>
        <div className="masthead-end">
          <p className="account">
            {firstname ? t('header.hello', { name: firstname }) : t('header.loggedIn')}
            <button type="button" className="link" onClick={() => onLogout()}>{t('header.logout')}</button>
          </p>
          <LanguageSwitch />
        </div>
      </header>

      <main>
        <div className="week-head">
          <h1>{t('week.heading')} <span>{weekLabel(monday, lang)}</span></h1>
          <nav className="week-nav" aria-label={t('week.nav')}>
            <button type="button" className="link" onClick={() => setMonday(addDays(monday, -7))} aria-label={t('week.previousLabel')}>{t('week.previous')}</button>
            <button type="button" className="link" onClick={() => setMonday(startOfWeek(new Date()))}>{t('week.current')}</button>
            <button type="button" className="link" onClick={() => setMonday(addDays(monday, 7))} aria-label={t('week.nextLabel')}>{t('week.next')}</button>
          </nav>
        </div>

        {error && <p className="message message-error" role="alert">{t('errors.unreachable')}</p>}

        <section className={`week ${loading ? 'is-loading' : ''}`} aria-label={t('week.meals', { label: weekLabel(monday, lang) })} aria-busy={loading}>
          {days.map((day, index) => (
            <div className="day" key={day.iso}>
              <h2 className="day-name">
                <span>{dayNames[index]}</span>
                <span className="day-number">{day.date.getDate()}</span>
              </h2>
              {MEALS.map((meal) => (
                <MealSlot
                  key={meal}
                  label={t(`meal.${meal}`)}
                  entry={bySlot.get(`${day.iso}|${meal}`)}
                  onAdd={() => setPicking({ day: day.iso, meal, dayIndex: index })}
                  onRemove={remove}
                />
              ))}
            </div>
          ))}
        </section>

        <ShoppingList key={weekKey} weekKey={weekKey} items={shopping} />
      </main>

      <footer className="footer">
        <p>{t('footer.about')}<a href={RECETTEVIE_URL}>RecetteVie</a></p>
        <p>
          <a href="https://github.com/puremax-lab/Semainier">{t('footer.source')}</a>
          <a href="https://github.com/puremax-lab">{t('footer.github')}</a>
          <a href={`${RECETTEVIE_URL}/mentions-legales`}>{t('footer.legal')}</a>
        </p>
      </footer>

      {picking && <RecipePicker slotLabel={`${dayNames[picking.dayIndex]} ${t(`meal.${picking.meal}`).toLowerCase()}`} onChoose={choose} onClose={() => setPicking(null)} />}
    </div>
  )
}
