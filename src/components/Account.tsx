import { useContext } from "react"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
export const Account = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  return (
    <div id="account">
      <h1>Account</h1>
      <label>Pubkey</label>
      <p>{identity ? identity.pubkey : null}</p>
    </div>
  )
}