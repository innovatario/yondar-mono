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
import { useParams } from "react-router-dom"

export const Dashboard = () => {
  const {setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [showProfile, setShowProfile] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const { param } = useParams() 

  useEffect(() => {
    // TODO: proper error handling if param is npub123 or something will crash...
    const isNpub = param && param.startsWith('npub')
    if (isNpub) {
      setShowProfile(true)
    } else {
      setShowProfile(false)
    }
  }, [param])

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
          { showProfile ? <ViewProfile npub={param || ""}/> : null }
        </YondarMap>
        { modal?.placeForm ? modal.placeForm === 'edit' ? <PlaceForm edit={true}/> : <PlaceForm edit={false}/> : null }
      </GeolocationProvider>
    </div>
  )
}