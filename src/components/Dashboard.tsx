import { useContext } from "react"
import { HomeButton } from "./HomeButton"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import defaultDisplayImage from '../assets/default-display-image.png'
import { ExportIdentityButton } from "./ExportIdentityButton"
import '../scss/Dashboard.scss'

export const Dashboard = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)

  const displayImage = identity.picture && identity.picture !== 'unknown' ? identity.picture : defaultDisplayImage

  return (
    <div id="dashboard">
      <h1>Dashboard</h1>
      <img className="profile-picture" src={displayImage} alt={`${identity.display_name}'s profile picture`}/>
      <p>Coming soon...</p>
      <HomeButton/><ExportIdentityButton/>
    </div>
  )
}