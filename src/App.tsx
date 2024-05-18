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
import { NavigationTargetProvider } from './providers/NavigationTargetProvider.tsx'
import { IntlProvider } from 'react-intl'
import translation from './localization/ru/compiled-lang/ru.json' //need fix
 

function App() {

  useEffect(() => {
    window.scrollTo(0, 1)
  }, [])

  return (
    <div id="app">
      <IntlProvider
        locale="ru"
        messages={translation}
      >
        <IdentityProvider>
          <NaddrProvider>
            <NavigationTargetProvider>
              <DraftPlaceProvider>
                <ModalProvider>
                  <ModeProvider>
                    <Routes>
                      <Route path="/" element={<Home/>}/>
                      <Route path="/login" element={<Login/>}/>
                      <Route path="/dashboard/:param?" element={<DashboardGuard/>}/>
                      <Route path="/logout" element={<Logout/>}/>
                      <Route path="/place/:naddr" element={<DashboardGuard/>}/>
                      <Route path="/user/:param?" element={<DashboardGuard/>}/>
                    </Routes>
                  </ModeProvider>
                </ModalProvider>
              </DraftPlaceProvider>
            </NavigationTargetProvider>
          </NaddrProvider>
        </IdentityProvider>
        </IntlProvider>
    </div>
  )
}

export default App
