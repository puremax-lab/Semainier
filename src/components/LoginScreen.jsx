import { useState } from 'react'
import { login } from '../lib/api.js'

const DEMO_ACCOUNT = { email: 'camille@recettevie.test', password: 'password' }

export default function LoginScreen({ notice, onLogin }) {
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
      setError(e.message)
      setPending(false)
    }
  }

  function fillDemo() {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
  }

  return (
    <main className="login">
      <div className="login-intro">
        <p className="kicker">Semainier</p>
        <h1>Les repas de la semaine, sur une seule page.</h1>
        <p className="lead">
          Choisissez une recette de <a href="https://puremax-lab.alwaysdata.net/recettevie">RecetteVie</a> pour
          chaque midi et chaque soir. La liste de courses se fait toute seule.
        </p>
      </div>

      <form className="login-form" onSubmit={submit} noValidate>
        <h2>Connexion</h2>
        <p className="muted">Avec votre compte RecetteVie.</p>
        {notice && <p className="message" role="status">{notice}</p>}
        {error && <p className="message message-error" role="alert">{error}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="button" disabled={pending || !email || !password}>
          {pending ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="demo">
          Pour essayer : <button type="button" className="link" onClick={fillDemo}>remplir avec le compte de démonstration</button>
        </p>
      </form>
    </main>
  )
}
