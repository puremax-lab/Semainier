// The JWT is kept in localStorage so the member stays logged in after a reload,
// until the token expires (1 hour, set by RecetteVie).

const KEY = 'semainier.token'

/** The token's payload: { username, firstname, exp, … }, or null if it cannot be read. */
export function decodeToken(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '=')), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

export function isExpired(token, now = Date.now()) {
  const payload = decodeToken(token)
  return !payload || payload.exp * 1000 <= now
}

export function loadToken() {
  try {
    const token = localStorage.getItem(KEY)
    return token && !isExpired(token) ? token : null
  } catch {
    return null
  }
}

export function saveToken(token) {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    // Private browsing: the member simply logs in again next time.
  }
}
