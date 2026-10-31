/** "45 min", "1 h", "1 h 15". */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const rest = minutes % 60
  return `${Math.floor(minutes / 60)} h${rest ? ` ${String(rest).padStart(2, '0')}` : ''}`
}
