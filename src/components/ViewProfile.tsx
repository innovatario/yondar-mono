//zoom out function then display the profile
// with list of beacons etc
import { useEffect, useState } from "react"
import { getMyProfile } from "../libraries/Nostr"
import { nip19 } from "nostr-tools"
import { AccountProfile } from "./AccountProfile"
import { IdentityType } from "../types/IdentityType"
import "../scss/LogoButton.scss"
import { useMap } from "react-map-gl"
import { useNavigate } from "react-router-dom"

interface ViewProfileProps {
  npub?: string;
}

export const ViewProfile = ({ npub }: ViewProfileProps) => {
  const [metadata, setMetadata] = useState<IdentityType>()
  const navigate = useNavigate()
  const hex = npub ? nip19.decode(npub).data.toString() : null
  const { current: map } = useMap()


  useEffect(() => {
    map && console.log("zoom out")
    map &&
      map.flyTo({
        zoom: 15.5,
        duration: 1000,
      })
  }, [map])

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const loadedProfile = await getMyProfile(hex as string)
        setMetadata(loadedProfile)
      } catch (error) {
        console.error('Error decoding npub:', error)
        // Handle the error as needed
      }
    }
    getUserProfile()
  }, [hex])

  const [toggle, setToggle] = useState<boolean>(true)

  const doToggle = () => {
    setToggle(!toggle)
    navigate("/dashboard")
  }
  const handleLink = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (!metadata) return
    const npub = nip19.npubEncode(metadata.pubkey)
    window.open(`https://njump.me/${npub}`, '_blank', 'noopener noreferrer')
  }
  const outerClasses =
    "component-logobutton " + (toggle ? "active" : "inactive")

  const profile = (
    <div className="component-logobutton-menu">
      <div className="wrapper">
        <>{metadata ? <AccountProfile identity={metadata} /> : null }</>
        <>{ metadata ? <button onClick={handleLink}>Go to Full Account</button>: null }</>

      </div>
    </div>
  )

  return (
    <>
      <div className={outerClasses} onClick={doToggle}>
        {toggle && metadata ? profile : null}
      </div>
    </>
  )
}
