// Week helpers. Days are handled as local dates and sent to the API as "YYYY-MM-DD".

const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

/** Monday of the week that contains the given date, at midnight. */
export function startOfWeek(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

export function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** "2026-11-02", without the time zone shift that toISOString() would add. */
export function toIsoDay(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** The 7 days of the week starting on the given Monday. */
export function weekDays(monday) {
  return DAY_NAMES.map((name, i) => {
    const date = addDays(monday, i)
    return { name, date, iso: toIsoDay(date) }
  })
}

/** "du 2 au 8 novembre 2026", or "du 30 novembre au 6 décembre 2026" across two months. */
export function weekLabel(monday) {
  const sunday = addDays(monday, 6)
  const end = `${sunday.getDate()} ${MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`
  const start = monday.getMonth() === sunday.getMonth()
    ? `${monday.getDate()}`
    : `${monday.getDate()} ${MONTHS[monday.getMonth()]}${monday.getFullYear() === sunday.getFullYear() ? '' : ` ${monday.getFullYear()}`}`
  return `du ${start} au ${end}`
}
