import { useContext, useState } from "react"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { nip19 } from "nostr-tools"
import { AccountProfile } from "./AccountProfile"

export const MyAccount = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const [handleProfile, setHandleProfile] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setHandleProfile(!handleProfile)
  }
  const handleLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const npub = nip19.npubEncode(identity.pubkey)
    window.open(`https://njump.me/${npub}`, '_blank', 'noopener noreferrer')
  }

  return (
    <>
    { handleProfile ? <AccountProfile identity={identity}/> : null }
    { handleProfile ? <button onClick={handleLink}>Go to Full Account</button>: <button onClick={handleClick}>View My Account</button> }
    <br/>
    </>
  )
  

}
