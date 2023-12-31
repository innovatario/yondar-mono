import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityContextType } from "../types/IdentityType"
import { IdentityContext } from "../providers/IdentityProvider"
import { generatePrivateKey, getPublicKey } from 'nostr-tools'
import { encryptAndStorePrivateKey } from '../libraries/EncryptAndStoreLocal'
import { FancyButton } from './FancyButton'
import { WavyText } from './WavyText'

export const SignUpButton = () => {
  const { identity, setIdentity } = useContext<IdentityContextType>(IdentityContext)
  const navigate = useNavigate()

  const newIdentity = async () => {
    const sk = generatePrivateKey() // `sk` is a hex string
    const pk = getPublicKey(sk) // `pk` is a hex string
    const proceed = await encryptAndStorePrivateKey(sk)
    if (proceed === false) return
    setIdentity({pubkey: pk})
    navigate('/login')
  }

  if (identity) {
    return null
  } else {
    return (
      <FancyButton onClick={newIdentity}><WavyText text="Quick Signup"/></FancyButton>
    )
  }
}