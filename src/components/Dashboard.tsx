import { useContext, useEffect, useState } from "react"
import { HomeButton } from "./HomeButton"
import { ExportIdentityButton } from "./ExportIdentityButton"
import { WipeIdentityButton } from "./WipeIdentityButton"
import { YondarMap } from "./YondarMap"
import { LogoButton } from "./LogoButton"
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { PlaceForm } from "./PlaceForm"
import { GeolocationProvider } from '../providers/GeolocationProvider.tsx'
import { MyAccount } from "./MyAccount"
import '../scss/Dashboard.scss'
import { freshDefaultPlace } from "../libraries/defaultPlace.tsx"
import { DraftPlaceContext } from "../providers/DraftPlaceProvider.tsx"
import { DraftPlaceContextType } from "../types/Place.tsx"
import { ViewProfile } from "./ViewProfile.tsx"
import { useNavigate, useParams } from "react-router-dom"
import { isValidNpub } from "../libraries/Nostr.ts"

export const Dashboard = () => {
  const {setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [showProfile, setShowProfile] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const navigate = useNavigate()
  const { param } = useParams() 
  
  useEffect(() => {
    // check if npub is valid
    const isNpub = isValidNpub(param as string)
    console.log('param',param,'isNpub',isNpub)
    if (isNpub) {
      setShowProfile(true)
    } else if (param) {
      // Handle the case when param is not a valid 'npub'
      navigate("/dashboard")
      setShowProfile(false)
    } else {
      setShowProfile(false)
      // don't do anything else here if param is undefined because this would prevent naddrs for places from being accessible when you click a place.
    }
  }, [navigate, param])

  // only request geolocation after the user interacts with the page
  const initialInteraction = () => {
    setUserInteracted(true)
  }

  useEffect( () => {
    if (modal?.placeForm === true) {
      setDraftPlace(freshDefaultPlace())
    }
  },[modal?.placeForm, setDraftPlace])

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
          { showProfile ? <ViewProfile npub={param}/> : null }
        </YondarMap>
        { modal?.placeForm ? modal.placeForm === 'edit' ? <PlaceForm edit={true}/> : <PlaceForm edit={false}/> : null }
      </GeolocationProvider>
    </div>
  )
}