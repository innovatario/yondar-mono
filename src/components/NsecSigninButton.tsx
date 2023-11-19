import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdentityContextType } from "../types/IdentityType"
import { IdentityContext } from "../providers/IdentityProvider"
import { encryptAndStorePrivateKey } from '../libraries/EncryptAndStoreLocal'
import { getPublicKey as getPubkey, nip19} from 'nostr-tools'
export const NsecSignInButton = () => {
  const { identity, setIdentity } = useContext<IdentityContextType>(IdentityContext)
  const navigate = useNavigate()
  const signInWithNsec = async () => {
    alert('⚠️ Warning: Using an nsec private key for login is permissible, but not recommended. Consider using a more secure method such as a NIP-07 extension for enhanced protection. ⚠️')
    const nsec = prompt('SignIn With Your Nsec (Private Key)')
    if (!nsec) {
      alert('No nsec was provided. Please check your private key and try again.')
      return
    }
    try { 
      const sk = nip19.decode(nsec).data
      const pk= getPubkey(sk.toString())
      const proceed = await encryptAndStorePrivateKey(pk, false)
      if (proceed === false) return
      setIdentity({pubkey: pk})
      navigate('/login')
    } catch {
      alert('An invalid nsec was provided. Please check your private key and try again.')
      return
    }
  }
  if (identity) {
    return
  } else {
    return (
      <>
        <button type='button' onClick={signInWithNsec}>Sign in with Nsec</button>
      </>
    )
  }
}