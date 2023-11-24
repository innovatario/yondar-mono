//zoom out function then display the profile
// with list of beacons etc
import {  useEffect, useState } from "react"
import { getMyProfile } from "../libraries/Nostr"
import { nip19 } from "nostr-tools"
import { AccountProfile } from "./AccountProfile"
import { IdentityType } from "../types/IdentityType"
import '../scss/LogoButton.scss'
import { useMap } from "react-map-gl"

interface ViewProfileProps {
    npub: string
    children?: React.ReactNode
  }

export const ViewProfile = ({npub,children} : ViewProfileProps) => {
  const [metadata, setMetadata] = useState<IdentityType>()
  const hex = npub ? nip19.decode(npub).data.toString() : undefined
  const {current: map} = useMap()

  useEffect(() => {
    map && console.log('zoom out')
    map && map.flyTo({
      zoom: 1,
      duration: 2000,
    })
    }, [map])

  useEffect(() => {
    const getUserProfile = async () => {
      // getting users metadata potential later more stuff like reviews, list of places etc
      const loadedProfile =  await getMyProfile(hex as string)
        setMetadata(loadedProfile)
    }
    getUserProfile()
    }, [hex])


const [toggle, setToggle] = useState<boolean>(true)

  const doToggle = () => setToggle(!toggle)

  const outerClasses = 'component-logobutton ' + (toggle ? 'active' : 'inactive') 
  const classes = 'button ' + (toggle ? 'active' : 'inactive')

  const menu = (
    <div className='component-logobutton-menu'>
      <div className='wrapper'>
        { children }
      </div>
    </div>
  )

  
  return (
    <>
        <div className={outerClasses} onClick={doToggle}>
            { toggle ? menu : null }
            <div >
            { metadata ? <AccountProfile identity={metadata}/> : null }
            </div>
        </div>
    </>
  )
  

}
