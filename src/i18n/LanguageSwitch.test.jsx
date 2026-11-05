import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'
import Planner from '../components/Planner.jsx'
import { LanguageProvider } from './LanguageProvider.jsx'
import { MESSAGES } from './messages.js'
import { weekDays, weekLabel } from '../lib/dates.js'
import { formatDuration } from '../lib/format.js'
import { recipeIngredients, recipeTitle } from '../lib/recipe.js'
import { buildShoppingList } from '../lib/shopping.js'

const quiche = {
  id: 7, title: 'Quiche lorraine', titleEn: 'Quiche Lorraine', slug: 'quiche-lorraine', duration: 75, imageName: null,
  category: { name: 'Plats', slug: 'plats' }, ingredients: ['3 œufs'], ingredientsEn: ['3 eggs'],
}

function mockApi(week = []) {
  const urls = []
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
    urls.push(String(url))
    if (String(url).startsWith('/api/recipes')) return new Response(JSON.stringify({ member: [quiche], totalItems: 1 }))
    return new Response(JSON.stringify({ member: week }))
  })
  return urls
}

describe('language', () => {
  it('starts in French', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'FR' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Connexion')
    expect(document.documentElement.lang).toBe('fr')
  })

  it.each([
    ['en-GB', 'Log in'],
    ['en', 'Log in'],
    ['fr-BE', 'Connexion'],
    ['de-DE', 'Log in'],
    ['es', 'Log in'],
  ])('follows a browser set to %s on the first visit', (browser, heading) => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(browser)
    render(<App />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(heading)
  })

  it('keeps the chosen language over the language of the browser', async () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-GB')
    const { unmount } = render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'FR' }))
    unmount()

    render(<App />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Connexion')
  })

  it('switches the login screen, the page title and the lang attribute live', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'EN' }))

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Log in')
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe("Semainier · the week's meals")
  })

  it('remembers the choice after a reload', async () => {
    const { unmount } = render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    unmount()

    render(<App />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Log in')
  })

  it('ignores an unknown stored language', () => {
    localStorage.setItem('semainier.lang', 'de')

    render(<App />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Connexion')
  })

  it('shows the week in English, with the English recipe and ingredients', async () => {
    localStorage.setItem('semainier.lang', 'en')
    mockApi([{ id: 1, day: '2026-11-03', meal: 'dinner', recipe: quiche }])
    render(<LanguageProvider><Planner token="t" firstname="Camille" onLogout={() => {}} today={new Date(2026, 10, 2)} /></LanguageProvider>)

    expect(await screen.findByRole('link', { name: 'Quiche Lorraine' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Week 2 to 8 November 2026')
    expect(screen.getByRole('heading', { name: /Tuesday/ })).toBeInTheDocument()
    expect(screen.getByText('3 eggs')).toBeInTheDocument()
    expect(screen.getByText('1 h 15 min')).toBeInTheDocument()
  })

  it('searches the English titles and translates the categories in the picker', async () => {
    localStorage.setItem('semainier.lang', 'en')
    const urls = mockApi()
    render(<LanguageProvider><Planner token="t" onLogout={() => {}} today={new Date(2026, 10, 2)} /></LanguageProvider>)

    await userEvent.click((await screen.findAllByRole('button', { name: '+ Choose a recipe' }))[0])
    expect(await screen.findByText(/Main courses/)).toBeInTheDocument()
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search for a recipe' }), 'quiche')

    await vi.waitFor(() => expect(urls.at(-1)).toContain('titleEn=quiche'))
  })

  it('has the same keys in both languages', () => {
    expect(Object.keys(MESSAGES.en).sort()).toEqual(Object.keys(MESSAGES.fr).sort())
  })
})

describe('localized helpers', () => {
  it('falls back to French when a recipe has no English text', () => {
    const old = { title: 'Soupe', ingredients: ['1 oignon'], ingredientsEn: [] }

    expect(recipeTitle(old, 'en')).toBe('Soupe')
    expect(recipeIngredients(old, 'en')).toEqual(['1 oignon'])
  })

  it('writes dates and durations in English', () => {
    const monday = new Date(2026, 10, 30)

    expect(weekLabel(monday, 'en')).toBe('30 November to 6 December 2026')
    expect(weekDays(monday, 'en')[0].name).toBe('Monday')
    expect(formatDuration(60, 'en')).toBe('1 h')
  })

  it('builds the shopping list in the chosen language', () => {
    const [line] = buildShoppingList([{ recipe: quiche }], 'en')

    expect(line.text).toBe('3 eggs')
    expect(line.recipes).toEqual(['Quiche Lorraine'])
  })
})
