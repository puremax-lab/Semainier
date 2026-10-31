import { describe, expect, it } from 'vitest'
import { decodeToken, isExpired, loadToken, saveToken } from './session.js'

/** A fake JWT: only the payload matters to the app, the signature is checked by RecetteVie. */
export function fakeToken(payload) {
  const encode = (value) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value)))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${encode({ alg: 'RS256' })}.${encode(payload)}.signature`
}

describe('session', () => {
  it('reads the first name, accents included', () => {
    expect(decodeToken(fakeToken({ firstname: 'Léna', exp: 1 })).firstname).toBe('Léna')
  })

  it('knows when the token has expired', () => {
    const token = fakeToken({ exp: 1000 })
    expect(isExpired(token, 999_000)).toBe(false)
    expect(isExpired(token, 1_000_000)).toBe(true)
    expect(isExpired('not a token')).toBe(true)
  })

  it('keeps a valid token after a reload, but not an expired one', () => {
    const valid = fakeToken({ exp: Date.now() / 1000 + 3600 })
    saveToken(valid)
    expect(loadToken()).toBe(valid)

    saveToken(fakeToken({ exp: Date.now() / 1000 - 1 }))
    expect(loadToken()).toBeNull()
  })
})
