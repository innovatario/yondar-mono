import { Routes, Route } from 'react-router-dom'
import { IdentityProvider } from './providers/IdentityProvider.tsx'
import { Home } from './components/Home'
import { Account } from './components/Account'
import './App.css'

function App() {

  return (
    <div id="app">
        <IdentityProvider>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/account" element={<Account/>}/>
          </Routes>
        </IdentityProvider>
    </div>
  )
}

export default App
