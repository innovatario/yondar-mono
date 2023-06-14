import { useContext } from "react"
import { HomeButton } from "./HomeButton"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { ExportIdentityButton } from "./ExportIdentityButton"
import '../scss/Dashboard.scss'
import { WipeIdentityButton } from "./WipeIdentityButton"
import defaultDisplayImage from '../assets/default-display-image.png'
import defaultBanner from '../assets/default-banner.png'

export const Dashboard = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)

  const displayImage = identity?.picture && identity.picture !== 'unknown' ? identity.picture : defaultDisplayImage

  const background = identity?.banner && identity.banner !== 'unknown' ? identity.banner : defaultBanner
  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const displayName = identity?.display_name && identity?.display_name !== 'unknown' ? identity.display_name : identity?.displayName && identity?.displayName !== 'unknown' ? identity.displayName : 'unknown'

  const about = identity?.about && identity.about !== 'unknown' ? identity.about : 'Just an anonymous lone Yondarer' 

  return (
    <div id="dashboard">
      <div className="flexcol">
        <h1>Dashboard</h1>
      </div>
      <div className="profile flexcol align-center" style={backgroundStyle}>
        <img className="profile-picture" src={displayImage} alt={`${displayName}'s profile picture`}/>&nbsp;
        <h1 className="display-name crush">{displayName}</h1>
        <p className="about full">{about}</p>
      </div>
      <br/>
      <div className="flexcol">
        <HomeButton/><ExportIdentityButton/><WipeIdentityButton/>
      </div>
    </div>
  )
}