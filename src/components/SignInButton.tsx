import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityContextType } from "../types/IdentityType"
import { IdentityContext } from "../providers/IdentityProvider"
import { getPublicKey } from "../libraries/NIP-07"
import { WavyText } from './WavyText'

export const SignInButton = () => {
  const { setIdentity, isIdentityFresh } = useContext<IdentityContextType>(IdentityContext)
  const navigate = useNavigate()

  const signIn = async () => {
    // trigger sign in with extension
    const success = await getPublicKey()
    if (success) {
      // store pubkey in identity provider
      setIdentity({pubkey: success})
      // redirect to account page
      navigate('/login')
    } else {
      // trigger "key not set up yet" dialog
    }
  }
  if (isIdentityFresh()) {
    return (
      <div className="column">
      You are already signed in!
      <br/>
      <br/>
      <button className="fancybutton lg" type='button' onClick={() => navigate('/login')}><WavyText text="Go Yondar"/></button>
      </div>
    )
  } else {
    return (
      <button type='button' onClick={signIn}>Sign in with Extension</button>
    )
  }
}