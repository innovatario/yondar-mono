import { useState, useEffect } from 'react'
import { ModalType } from '../types/ModalType'
import { Filter } from 'nostr-tools'
import { getRelayList, pool } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { isOpenNow } from '../libraries/decodeDay'
import { DraftPlaceContextType, Place } from '../types/Place'
import { beaconToDraftPlace } from '../libraries/draftPlace'
import { CursorPositionType } from '../providers/GeolocationProvider'
import { RelayList, RelayObject } from '../types/NostrRelay'
import { MapPin } from './MapPin'

type BeaconProps = {
  currentUserPubkey: string | undefined
  relays: RelayObject
  beaconData: Place
  modal: ModalType
  clickHandler: () => void
  editHandler: () => void
  draft: DraftPlaceContextType
}
export const Beacon = ({ currentUserPubkey, relays, beaconData, modal, clickHandler, editHandler, draft }: BeaconProps) => {
  const [show, setShow] = useState<boolean>(false)
  const [beaconProfilePicture, setBeaconProfilePicture] = useState<string>('')
  const { setDraftPlace } = draft
  const { setCursorPosition } = useGeolocationData()
  const relayList: RelayList = getRelayList(relays, ['read'])

  useEffect(() => {
    // get profile for beacon owner (pubkey) by querying for most recent kind 0 (profile)
    const filter: Filter = { kinds: [0], authors: [beaconData.pubkey] }
    const profileSub = pool.sub(relayList, [filter])
    profileSub.on('event', (event) => {
      // this will return the most recent profile event for the beacon owner; only the most recent is stored as specified in NIP-01
      try {
        const profile = JSON.parse(event.content)
        setBeaconProfilePicture(profile.picture)
      } catch (e) {
        console.log('Failed to parse event content:', e)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    if (!modal?.placeForm) {
      if (!show) clickHandler()
      if (!show) setCursorPosition(null)
      setShow(!show)
    }
  }

  const editPlace = () => {
    editHandler()
    // set cursor to beacon's current coordinates
    const lnglat: CursorPositionType = {
      lng: beaconData.content.geometry.coordinates[0],
      lat: beaconData.content.geometry.coordinates[1]
    }
    setCursorPosition(lnglat)
    // load place data into modal 
    const newPlace = beaconToDraftPlace(beaconData, relayList)
    // set draft place
    setDraftPlace(newPlace)
    modal?.setPlaceForm('edit')
  }

  const mapMarker = <div className="beacon__marker" onClick={toggle}>{<MapPin color={`#${beaconData.pubkey.substring(0, 6)}`} image={beaconProfilePicture} />}</div>

  const showBeaconInfo = () => {

    let beaconName = null
    try {
      beaconName = <h2>{beaconData.content.properties.name}</h2>
    } catch (e) {
      console.log('failed to parse name', e)
    }

    let beaconDescription = null
    try {
      beaconDescription = <p>{beaconData.content.properties.description}</p>
    } catch (e) {
      console.log('failed to parse description', e)
    }

    let hours = null
    try {
      hours = <p className="hours">{
        beaconData.content.properties.hours
        ? 
          isOpenNow(beaconData.content.properties.hours)
          ? 
            <>
              "🟢 Open Now" : "⛔ Not Open Right Now"
              <br />
              <small>{beaconData.content.properties.hours}</small>
            </>
          : null
        : null
      }</p>
    } catch (e) {
      // console.log('failed to parse hours', e)
    }

    let edit = null
    try {
      if (currentUserPubkey === beaconData.pubkey)
        edit = <button onClick={editPlace} style={{ float: "right", marginTop: "1.5rem", marginRight: "-1.0rem" }}>Edit</button>
    } catch (e) {
      console.log('', e)
    }

    return (
      <div className="beacon__info" onClick={toggle}>
        {beaconName}
        {beaconDescription}
        {hours}
        {edit}
      </div>
    )
  }

  const beaconClasses = `beacon ${show ? 'beacon--show' : ''}`

  return (
    <div className={beaconClasses}>
      {mapMarker}
      {show ? showBeaconInfo() : null}
    </div>
  )
}
