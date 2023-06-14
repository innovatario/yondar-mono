import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { defaultProfile, getMyProfile } from "../libraries/Nostr"
import { Spinner } from './Spinner'

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const {identity, setIdentity, isIdentityFresh} = useContext<IdentityContextType>(IdentityContext)
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      // retrieve profile from relays
      const loadedProfile = await getMyProfile(identity.pubkey)
      if (loadedProfile === defaultProfile) {
        // no profile found. use default as template but add pubkey
        const newProfile = {...defaultProfile, pubkey: identity.pubkey, last_updated: +new Date()}
        setIdentity(newProfile)
      } else {
        const profile = {...loadedProfile, pubkey: identity.pubkey, last_updated: +new Date()}
        setIdentity(profile)
      }
    }
    // redirect to homepage if login page is accessed with no identity
    if (!identity) {
      navigate('/')
    } else if (isIdentityFresh()) {
      // profile is still fresh. redirect to dashboard
      navigate('/dashboard')
    } else {
      // proceed with loading profile
      setLoading(true)
      loadProfile()
    }
  }, [identity])

  return (
    <div id="login">
      <h1>Logging In...</h1>
      <label>With public key</label>
      <p>{identity ? identity.pubkey : null}</p>
      {loading ? <Spinner/> : null}
    </div>
  )
}