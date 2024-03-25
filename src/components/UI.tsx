import { Identity } from './Identity'
import { Logout } from './Logout'
import { MyAccount } from './MyAccount'
import { ViewProfile } from './ViewProfile'
import { WipeIdentityButton } from './WipeIdentityButton'

export const UI: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div id="ui">
      <Identity>
        <ViewProfile/>
      </Identity>
      {children}
    </div>
  )
}