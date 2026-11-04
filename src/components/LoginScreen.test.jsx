import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginScreen from './LoginScreen.jsx'

describe('LoginScreen', () => {
  it('sends the demo account and hands the token over', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ token: 'abc' })))
    const onLogin = vi.fn()
    render(<LoginScreen onLogin={onLogin} />)

    await userEvent.click(screen.getByRole('button', { name: /compte de démonstration/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(onLogin).toHaveBeenCalledWith('abc')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ email: 'camille@recettevie.test', password: 'password' })
  })

  it('sends visitors without an account to the RecetteVie sign-up page', () => {
    render(<LoginScreen onLogin={() => {}} />)

    expect(screen.getByRole('link', { name: 'Créez-le sur RecetteVie' })).toHaveAttribute('href', 'https://puremax-lab.alwaysdata.net/recettevie/inscription')
  })

  it('shows an error for a wrong password', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 401 }))
    render(<LoginScreen onLogin={() => {}} />)

    await userEvent.type(screen.getByLabelText('Email'), 'camille@recettevie.test')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect.')
  })
})
