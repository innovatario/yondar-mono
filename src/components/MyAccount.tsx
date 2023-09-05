import { useContext } from "react"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { nip19 } from "nostr-tools"

export const MyAccount = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const npub = nip19.npubEncode(identity.pubkey)
    window.open(`https://nostr.com/${npub}`, '_blank', 'noopener noreferrer')
  }
  return (
    <button onClick={handleClick}>View My Account</button>
  )
}