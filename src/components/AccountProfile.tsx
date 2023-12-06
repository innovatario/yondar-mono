
import { IdentityType } from "../types/IdentityType"
import defaultDisplayImage from '../assets/default-display-image.png'
import defaultBanner from '../assets/default-banner.png'
import '../scss/MyAccountProfile.scss'
import { Nip05Verifier } from "./Nip05Verifier"
import {  FaLink  } from "react-icons/fa"

interface AccountProfileProps {
  identity: IdentityType;
}

export const AccountProfile = ({ identity }: AccountProfileProps) => {
  
  const displayImage = identity?.picture && identity.picture !== 'unknown' ? identity.picture : defaultDisplayImage

  const background = identity?.banner && identity.banner !== 'unknown' ? identity.banner : defaultBanner
  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
  const displayName = identity?.display_name && identity?.display_name !== 'unknown' ? identity.display_name : identity?.displayName && identity?.displayName !== 'unknown' ? identity.displayName : 'unknown' && identity?.name && identity?.name !== 'unknown' ? identity.name : 'unknown'
  const website = identity?.website && identity?.website !== null ? identity.website : null
  const websitepretty = website?.replace('http://', '').replace('https://', '').replace('www.', '')

  const $profile = (
    <>
      <div className="profileBox">
        <div className="flexcol align-center background-picture" style={backgroundStyle}>
          <img className="profile-picture" src={displayImage} alt={`${displayName}'s profile picture`}/>&nbsp;
        </div>
          <div className="profile-name-box">
            <div className="profile-name">{displayName}</div>
            <Nip05Verifier pubkey={identity?.pubkey} nip05Identifier={identity?.nip05} />
            { website ? <a href={website} target="_blank" rel="noreferrer" className="website-link"><FaLink size={10}/>{websitepretty}</a> : null }
          </div>
          {/* FUTURE TODO: rendering here the personal stuff  */}

        {/* <div className="about full">
            List of Places I have added:
            <br/>
            List of Reviews I have wrote:
            <br/>
            List of Reviews I have liked:
            <br/>
            Add a new Place:
            <br/>
        </div> */}
      </div>
      <br/>
    </>
  )

  return (
    <>
        { $profile }
    </>
  )
  

}
