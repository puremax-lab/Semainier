import { useLanguage } from '../i18n/language.js'
import { LANGUAGES } from '../i18n/messages.js'

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {LANGUAGES.map((code) => (
        <button key={code} type="button" lang={code} aria-pressed={code === lang} onClick={() => setLang(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
