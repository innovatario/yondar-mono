import { useContext } from "react"
import { HomeButton } from "./HomeButton"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import defaultDisplayImage from '../assets/default-display-image.png'
import { ExportIdentityButton } from "./ExportIdentityButton"
import '../scss/Dashboard.scss'
import { WipeIdentityButton } from "./WipeIdentityButton"

export const Dashboard = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)

  const displayImage = identity?.picture && identity.picture !== 'unknown' ? identity.picture : defaultDisplayImage

  const displayName = identity?.display_name && identity?.display_name !== 'unknown' ? identity.display_name : identity?.displayName && identity?.displayName !== 'unknown' ? identity.displayName : 'unknown'

  return (
    <div id="dashboard">
      <div className="flexcol">
        <h1>Dashboard</h1>
      </div>
      <div className="flexcol aligncenter">
        <img className="profile-picture" src={displayImage} alt={`${displayName}'s profile picture`}/>&nbsp;
        <h1 className="crush">{displayName}</h1>
      </div>
      <br/>
      <div className="flexcol">
        <HomeButton/><ExportIdentityButton/><WipeIdentityButton/>
      </div>
    </div>
  )
}