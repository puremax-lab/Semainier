import { useState } from 'react'
import { useLanguage } from '../i18n/language.js'
import { AuthError, login } from '../lib/api.js'
import { RECETTEVIE_URL } from '../lib/links.js'
import LanguageSwitch from './LanguageSwitch.jsx'

const DEMO_ACCOUNT = { email: 'camille@recettevie.test', password: 'password' }

export default function LoginScreen({ notice, onLogin }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      onLogin(await login(email, password))
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'errors.unreachable')
      setPending(false)
    }
  }

  function fillDemo() {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
  }

  return (
    <main className="login">
      <div className="login-lang"><LanguageSwitch /></div>
      <div className="login-intro">
        <p className="kicker">Semainier</p>
        <h1>{t('login.title')}</h1>
        <p className="lead">
          {t('login.leadStart')}<a href={RECETTEVIE_URL}>RecetteVie</a>{t('login.leadEnd')}
        </p>
      </div>

      <form className="login-form" onSubmit={submit} noValidate>
        <h2>{t('login.heading')}</h2>
        <p className="muted">{t('login.account')}</p>
        {notice && <p className="message" role="status">{t(notice)}</p>}
        {error && <p className="message message-error" role="alert">{t(error)}</p>}

        <label htmlFor="email">{t('login.email')}</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">{t('login.password')}</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="button" disabled={pending || !email || !password}>
          {pending ? t('login.pending') : t('login.submit')}
        </button>

        <p className="demo">
          {t('login.tryIt')}<button type="button" className="link" onClick={fillDemo}>{t('login.fillDemo')}</button>
        </p>
        <p className="demo">
          {t('login.noAccount')}<a href={`${RECETTEVIE_URL}/inscription`}>{t('login.signUp')}</a>{t('login.signUpEnd')}
        </p>
      </form>
    </main>
  )
}
