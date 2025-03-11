import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

import Chat from './pages/chat/Chat'
import Layout from './pages/layout/Layout'
import NoPage from './pages/NoPage'
import { AppStateProvider } from './state/AppProvider'
import TermsAndConditionsModal from './components/TermsAndConditionsModal/TermsAndConditionsModal'

import './index.css'

initializeIcons('https://res.cdn.office.net/files/fabric-cdn-prod_20241209.001/assets/icons/')

const App: React.FC = () => {
  const [showTerms, setShowTerms] = useState(() => {
    const agreedToTerms = localStorage.getItem('agreedToTerms')
    return agreedToTerms !== 'true'
  })

  const handleAgree = () => {
    setShowTerms(false)
    localStorage.setItem('agreedToTerms', 'true')
  }

  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Chat />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </HashRouter>
      <TermsAndConditionsModal hidden={!showTerms} onSubmit={handleAgree} />
    </AppStateProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
