import { useContext, useEffect, useState } from "react"
import { HomeButton } from "./HomeButton"
import { IdentityContext } from "../providers/IdentityProvider"
import { IdentityContextType } from "../types/IdentityType"
import { ExportIdentityButton } from "./ExportIdentityButton"
import { WipeIdentityButton } from "./WipeIdentityButton"
import { YondarMap } from "./YondarMap"
import { LogoButton } from "./LogoButton"
import defaultDisplayImage from '../assets/default-display-image.png'
import defaultBanner from '../assets/default-banner.png'
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { PlaceForm } from "./PlaceForm"
import { GeolocationProvider } from '../providers/GeolocationProvider.tsx'
import { MyAccount } from "./MyAccount"
import '../scss/Dashboard.scss'
import { freshDefaultPlace } from "../libraries/defaultPlace.tsx"
import { DraftPlaceContext } from "../providers/DraftPlaceProvider.tsx"
import { DraftPlaceContextType } from "../types/Place.tsx"
import { useParams } from "react-router-dom"
import { useNaddr } from "../hooks/useNaddr.tsx"

export const Dashboard = () => {
  const { naddr }: { naddr?: string } = useParams<{ naddr?: string }>()
  const { setNaddr } = useNaddr()
  const {identity} = useContext<IdentityContextType>(IdentityContext)
  const {setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [showProfile] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  // if the URL is /place/:naddr, save it into the context
  useEffect( () => {
    if (naddr) {
      setNaddr(naddr)
    }
  }, [naddr, setNaddr])

  // only request geolocation after the user interacts with the page
  const initialInteraction = () => {
    setUserInteracted(true)
  }

  useEffect( () => {
    if (modal?.placeForm === true) {
      setDraftPlace(freshDefaultPlace())
    }
  },[modal?.placeForm, setDraftPlace])

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

  const $profile = (
    <div className="profile flexcol align-center" style={backgroundStyle}>
      <img className="profile-picture" src={displayImage} alt={`${displayName}'s profile picture`}/>&nbsp;
      <h1 className="display-name crush">{displayName}</h1>
      <p className="about full">{about}</p>
    </div>
  )

  return (
    <div id="dashboard" onClick={initialInteraction}>
      <GeolocationProvider trigger={userInteracted}>
        <YondarMap>
          <LogoButton>
            <HomeButton/>
            <br/>
            <MyAccount/>
            <ExportIdentityButton/>
            <WipeIdentityButton/>
          </LogoButton>
          { showProfile ? $profile : null }
        </YondarMap>
        { modal?.placeForm ? modal.placeForm === 'edit' ? <PlaceForm edit={true}/> : <PlaceForm edit={false}/> : null }
      </GeolocationProvider>
    </div>
  )
}