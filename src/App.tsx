import { Routes, Route } from 'react-router-dom'
import { IdentityProvider } from './providers/IdentityProvider.tsx'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard.tsx'
import './App.css'

function App() {

  return (
    <div id="app">
        <IdentityProvider>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
          </Routes>
        </IdentityProvider>
    </div>
  )
}

export default App
