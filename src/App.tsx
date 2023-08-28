import { Routes, Route } from 'react-router-dom'
import { IdentityProvider } from './providers/IdentityProvider.tsx'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard.tsx'
import './scss/App.scss'
import { DraftPlaceProvider } from './providers/DraftPlaceProvider.tsx'
import { ModalProvider } from './providers/ModalProvider.tsx'

function App() {

  return (
    <div id="app">
        <IdentityProvider>
            <DraftPlaceProvider>
              <ModalProvider>
                <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
              </ModalProvider>
            </DraftPlaceProvider>
        </IdentityProvider>
    </div>
  )
}

export default App
