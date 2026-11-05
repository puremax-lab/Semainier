import { createContext, useContext } from 'react'
import { LANGUAGES, MESSAGES } from './messages.js'

const KEY = 'semainier.lang'
const DEFAULT = 'fr'

function storedLanguage() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** The visitor's choice, or else the browser's language: English stays English, anything else gives French. */
export function loadLanguage() {
  const stored = storedLanguage()
  if (LANGUAGES.includes(stored)) return stored
  return /^en\b/i.test(navigator.language) ? 'en' : DEFAULT
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    // Private browsing: the choice lasts until the next reload.
  }
}

/** The text for a key, with {placeholders} filled in. An unknown key is returned as it is. */
export function translate(lang, key, values = {}) {
  const text = MESSAGES[lang][key] ?? key
  return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '')
}

export const LanguageContext = createContext({ lang: DEFAULT, setLang: () => {}, t: (key, values) => translate(DEFAULT, key, values) })

export function useLanguage() {
  return useContext(LanguageContext)
}
