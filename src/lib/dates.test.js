import { describe, expect, it } from 'vitest'
import { startOfWeek, toIsoDay, weekDays, weekLabel } from './dates.js'

describe('dates', () => {
  it('finds the Monday of the week, Sunday included', () => {
    expect(toIsoDay(startOfWeek(new Date(2026, 10, 4)))).toBe('2026-11-02')
    expect(toIsoDay(startOfWeek(new Date(2026, 10, 8)))).toBe('2026-11-02')
    expect(toIsoDay(startOfWeek(new Date(2026, 10, 2)))).toBe('2026-11-02')
  })

  it('lists the 7 days from Monday to Sunday', () => {
    const days = weekDays(new Date(2026, 10, 2))
    expect(days.map((d) => d.name)).toEqual(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'])
    expect(days.at(-1).iso).toBe('2026-11-08')
  })

  it('writes the week in French, across months and years', () => {
    expect(weekLabel(new Date(2026, 10, 2))).toBe('du 2 au 8 novembre 2026')
    expect(weekLabel(new Date(2026, 10, 30))).toBe('du 30 novembre au 6 décembre 2026')
    expect(weekLabel(new Date(2026, 11, 28))).toBe('du 28 décembre 2026 au 3 janvier 2027')
  })
})
