import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { defaultProfile, defaultRelays, defaultContacts, getMyProfile, getMyRelays, getMyContacts } from "../libraries/Nostr"
import { Spinner } from './Spinner'
import { localStorageKey } from '../libraries/EncryptAndStoreLocal'

export const Logout = () => {
  const [loading, setLoading] = useState(false)
  const {identity, setIdentity, setRelays, setContacts} = useContext<IdentityContextType>(IdentityContext)
  const navigate = useNavigate()

  useEffect(() => {
    const wipe = async () => {
      navigate('/')
      localStorage.removeItem(localStorageKey)
      localStorage.removeItem(localStorageKey+'v')
      localStorage.removeItem(localStorageKey+'s')
      setRelays(defaultRelays)
      setContacts(defaultContacts)
      setIdentity(null)
    }
    wipe()
  }, [navigate, identity, setIdentity, setRelays, setContacts])

  return (
    <div id="login">
      <h1>Logging Out...</h1>
      {loading ? <Spinner/> : null}
    </div>
  )
}