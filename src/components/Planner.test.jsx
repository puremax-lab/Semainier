import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Planner from './Planner.jsx'

const quiche = { id: 7, title: 'Quiche lorraine', slug: 'quiche-lorraine', duration: 60, imageName: null, category: { name: 'Plats' }, ingredients: ['3 œufs', '200 g de lardons'] }
const curry = { id: 8, title: 'Curry de pois chiches', slug: 'curry', duration: 45, imageName: 'curry.jpg', category: { name: 'Végétarien' }, ingredients: ['400 g de pois chiches'] }

/** Answers the app's API calls like RecetteVie would. */
function mockApi({ week = [], status = 200 } = {}) {
  const calls = []
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method ?? 'GET', body: options.body && JSON.parse(options.body) })
    const json = (data, code = 200) => new Response(data === null ? null : JSON.stringify(data), { status: code })
    if (status !== 200) return json({}, status)
    if (String(url).startsWith('/api/meal_plan_entries?')) return json({ member: week })
    if (String(url).startsWith('/api/recipes')) return json({ member: [quiche, curry], totalItems: 2 })
    if (options.method === 'POST') {
      const body = JSON.parse(options.body)
      return json({ id: 99, day: body.day, meal: body.meal, recipe: curry }, 201)
    }
    if (options.method === 'DELETE') return json(null, 204)
    return json({}, 404)
  })
  return calls
}

const monday = new Date(2026, 10, 2)

describe('Planner', () => {
  it('shows the planned recipes in their slot and their ingredients in the shopping list', async () => {
    mockApi({ week: [{ id: 1, day: '2026-11-03', meal: 'dinner', recipe: quiche }] })
    render(<Planner token="t" firstname="Camille" onLogout={() => {}} today={monday} />)

    expect(await screen.findByRole('link', { name: 'Quiche lorraine' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('du 2 au 8 novembre 2026')
    const list = screen.getByRole('region', { name: 'Liste de courses' })
    expect(within(list).getByText('3 œufs')).toBeInTheDocument()
    expect(within(list).getByText('2 sur 2 à acheter')).toBeInTheDocument()
  })

  it('links back to RecetteVie from the header', async () => {
    mockApi()
    render(<Planner token="t" onLogout={() => {}} today={monday} />)

    expect(screen.getByRole('link', { name: 'Toutes les recettes sur RecetteVie' })).toHaveAttribute('href', 'https://puremax-lab.alwaysdata.net/recettevie')
    await screen.findByRole('region', { name: 'Liste de courses' })
  })

  it('asks the API for the displayed week only', async () => {
    const calls = mockApi()
    render(<Planner token="t" onLogout={() => {}} today={monday} />)

    await screen.findAllByRole('button', { name: '+ Choisir une recette' })
    expect(decodeURIComponent(calls[0].url)).toBe('/api/meal_plan_entries?day[after]=2026-11-02&day[before]=2026-11-08')
  })

  it('plans a recipe chosen in the picker', async () => {
    const calls = mockApi()
    render(<Planner token="t" onLogout={() => {}} today={monday} />)

    await userEvent.click((await screen.findAllByRole('button', { name: '+ Choisir une recette' }))[0])
    await userEvent.click(await screen.findByRole('button', { name: /Curry de pois chiches/ }))

    expect(await screen.findByRole('link', { name: 'Curry de pois chiches' })).toBeInTheDocument()
    expect(calls.find((c) => c.method === 'POST').body).toEqual({ recipe: '/api/recipes/8', day: '2026-11-02', meal: 'lunch' })
  })

  it('removes a recipe from the week', async () => {
    const calls = mockApi({ week: [{ id: 1, day: '2026-11-03', meal: 'dinner', recipe: quiche }] })
    render(<Planner token="t" onLogout={() => {}} today={monday} />)

    await userEvent.click(await screen.findByRole('button', { name: 'Retirer Quiche lorraine' }))

    expect(screen.queryByRole('link', { name: 'Quiche lorraine' })).not.toBeInTheDocument()
    expect(calls.at(-1)).toMatchObject({ url: '/api/meal_plan_entries/1', method: 'DELETE' })
  })

  it('logs out when the token is refused', async () => {
    mockApi({ status: 401 })
    const onLogout = vi.fn()
    render(<Planner token="expired" onLogout={onLogout} today={monday} />)

    await vi.waitFor(() => expect(onLogout).toHaveBeenCalledWith('errors.sessionExpired'))
  })
})
