import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { IdentityProvider } from './providers/IdentityProvider.tsx'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { DashboardGuard } from './components/DashboardGuard'
// import { Dashboard } from './components/Dashboard.tsx'
import './scss/App.scss'
import { DraftPlaceProvider } from './providers/DraftPlaceProvider.tsx'
import { ModalProvider } from './providers/ModalProvider.tsx'
import { NaddrProvider } from './providers/NaddrProvider.tsx'
import { Logout } from './components/Logout.tsx'
import { ModeProvider } from './providers/ModeProvider.tsx'

function App() {

  useEffect(() => {
    window.scrollTo(0, 1)
  }, [])

  return (
    <div id="app">
        <IdentityProvider>
          <NaddrProvider>
            <DraftPlaceProvider>
              <ModalProvider>
                <ModeProvider>
                  <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element={<DashboardGuard/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/place/:naddr" element={<DashboardGuard/>}/>
                  </Routes>
                </ModeProvider>
              </ModalProvider>
            </DraftPlaceProvider>
          </NaddrProvider>
        </IdentityProvider>
    </div>
  )
}

export default App
