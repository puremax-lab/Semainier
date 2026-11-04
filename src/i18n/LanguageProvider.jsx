import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext, loadLanguage, saveLanguage, translate } from './language.js'

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(loadLanguage)

  const setLang = useCallback((next) => {
    saveLanguage(next)
    setLangState(next)
  }, [])

  // The page itself follows the language: lang attribute for screen readers, tab title, description.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'page.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'page.description'))
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: (key, values) => translate(lang, key, values) }), [lang, setLang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
