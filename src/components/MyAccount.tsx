import { useContext, useState } from "react"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import defaultDisplayImage from '../assets/default-display-image.png'
import defaultBanner from '../assets/default-banner.png'
// import '../scss/Dashboard.scss'
import '../scss/MyAccount.scss'
import { Nip05Verifier } from "./Nip05Verifier"


export const MyAccount = () => {
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const [handleProfile, setHandleProfile] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setHandleProfile(!handleProfile)
  }
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

  const zapps = identity?.lud16 
  
  const $profile = (
    <>
      <div className="profileBox">
        <div className="flexcol align-center background-picture" style={backgroundStyle}>
          <img className="profile-picture" src={displayImage} alt={`${displayName}'s profile picture`}/>&nbsp;
        </div>
          <div className=" profile-name-box">
            <div className="profile-name">{displayName}</div>
            <div><Nip05Verifier pubkey={identity?.pubkey} nip05Identifier={identity?.nip05} /></div>
          </div>
        <div className="about full">
          <p className="">{about}</p>
          <p>{zapps}</p>
        </div>
      </div>
    </>
  )

  return (
    <>
    { handleProfile ? $profile : null }
    <br/>
    <button onClick={handleClick}>View My Account</button>
    <br/>
    </>
  )
  

}



  // const npub = nip19.npubEncode(identity.pubkey)
    // window.open(`https://njump.me/${npub}`, '_blank', 'noopener noreferrer')