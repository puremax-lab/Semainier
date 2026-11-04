import { useState } from 'react'
import LoginScreen from './components/LoginScreen.jsx'
import Planner from './components/Planner.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import { decodeToken, loadToken, saveToken } from './lib/session.js'

export default function App() {
  const [token, setToken] = useState(loadToken)
  const [notice, setNotice] = useState('')

  function logIn(newToken) {
    saveToken(newToken)
    setNotice('')
    setToken(newToken)
  }

  function logOut(reason = '') {
    saveToken(null)
    setNotice(reason)
    setToken(null)
  }

  return (
    <LanguageProvider>
      {token
        ? <Planner token={token} firstname={decodeToken(token)?.firstname} onLogout={logOut} />
        : <LoginScreen notice={notice} onLogin={logIn} />}
    </LanguageProvider>
  )
}
