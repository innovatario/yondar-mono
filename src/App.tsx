import { Routes, Route } from 'react-router-dom'
import { IdentityProvider } from './providers/IdentityProvider.tsx'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard.tsx'
import './scss/App.scss'
import { Publish } from './components/Publish.tsx'
import { GeolocationProvider } from './providers/GeolocationProvider.tsx'
import { DraftPlaceProvider } from './providers/DraftPlaceProvider.tsx'
import { ModalProvider } from './providers/ModalProvider.tsx'

function App() {

  return (
    <div id="app">
        <IdentityProvider>
          <GeolocationProvider>
            <DraftPlaceProvider>
              <ModalProvider>
                <Routes>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/publish" element={<Publish/>}/>
                </Routes>
              </ModalProvider>
            </DraftPlaceProvider>
          </GeolocationProvider>
        </IdentityProvider>
    </div>
  )
}

export default App
