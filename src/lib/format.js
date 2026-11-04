/** "45 min", "1 h", "1 h 15"; "1 h 15 min" in English. */
export function formatDuration(minutes, lang = 'fr') {
  if (minutes < 60) return `${minutes} min`
  const rest = minutes % 60
  if (lang === 'en') return `${Math.floor(minutes / 60)} h${rest ? ` ${rest} min` : ''}`
  return `${Math.floor(minutes / 60)} h${rest ? ` ${String(rest).padStart(2, '0')}` : ''}`
}
