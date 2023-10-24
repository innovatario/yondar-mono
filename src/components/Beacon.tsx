import { useState, useMemo, useEffect, useContext } from 'react'
import { ModalType } from '../types/ModalType'
import { Event, nip19 } from 'nostr-tools'
import { getRelayList } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { formatTimes, isOpenNow } from '../libraries/decodeDay'
import { DraftPlaceContextType, Place } from '../types/Place'
import { beaconToDraftPlace } from '../libraries/draftPlace'
import { CursorPositionType } from '../providers/GeolocationProvider'
import { IdentityType } from '../types/IdentityType'
import { RelayList, RelayObject } from '../types/NostrRelay'
import { MapPin } from './MapPin'
import { FancyButton } from './FancyButton'
import { Shared } from './Shared'
import { ModeContext } from '../providers/ModeProvider'

type BeaconProps = {
  currentUserPubkey: string | undefined
  ownerProfile: (Event & {content: IdentityType }) | undefined
  relays: RelayObject
  beaconData: Place
  modal: ModalType
  open: boolean,
  focusHandler: () => void
  editHandler: () => void
  draft: DraftPlaceContextType
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function sendSMS(phoneNumber: string) {
  const uri = isMobile ? `sms:${phoneNumber}` : `tel:${phoneNumber}`
  window.open(uri, '_blank')
}

export const Beacon = ({ currentUserPubkey, ownerProfile, relays, beaconData, modal, open, focusHandler, editHandler, draft }: BeaconProps) => {
  const [shared, setShared] = useState(false)
  const { setDraftPlace } = draft
  const { setCursorPosition } = useGeolocationData()
  const relayList: RelayList = getRelayList(relays, ['read'])
  const picture = ownerProfile?.content?.picture
  const {setMode} = useContext(ModeContext)

  const toggle = () => {
    if (!modal?.placeForm) {
      focusHandler()
      if (!open) {
        // we are opening the beacon details
        setCursorPosition(null)
        setMode(null)
      } else {
        // we are closing the beacon details
      }
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
    setMode(null)
  }

  // e is a click event
  const sharePlace = (e: React.MouseEvent<HTMLElement> ) => {
    e.stopPropagation()
    // copy URL to clipboard
    const url = window.location.href
    navigator.clipboard.writeText(url)
    // show toast
    setShared(true)
  }

  useEffect(() => {
    if (shared) {
      setTimeout(() => {
        setShared(false)
      }, 3000)
    }
  }, [shared])

  const mapMarker = useMemo( () => {
    return (
      <div className="beacon__marker" onClick={toggle}><MapPin color={`#${beaconData.pubkey.substring(0, 6)}`} image={picture || ''} /></div>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picture, toggle])

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
    if (beaconData.content.properties.hours) {
      try {
        hours = <p className="hours">{
          beaconData.content.properties.hours
          ? 
            isOpenNow(beaconData.content.properties.hours)
            ? 
              "🟢 Open Now" 
            : "💤 Not Open Right Now"
          : null }
          <br />
          <small>{formatTimes(beaconData.content.properties.hours)}</small>
        </p>

      } catch (e) {
        // console.log('failed to parse hours', e)
      }
    } 

    let typeInfo = null
    try {
      const currentType = beaconData.content.properties.type
      if (currentType) {
        typeInfo = <p className="type">{currentType.replace(/_/g,' ')}</p>
      }
    } catch (e) {
      console.log('failed to parse type', e)
    }
    
    let statusInfo = null
    try {
      const currentStatus = beaconData.content.properties.status
      if (currentStatus !== 'OPERATIONAL' || currentStatus === undefined) {
        // don't render OPERATIONAL because it is implied
        const currentStatusColor = currentStatus === 'CLOSED_TEMPORARILY' ? 'gray' : 'red'
        const currentStatusEmoji = currentStatus === 'CLOSED_TEMPORARILY' ? '⛔' : '⛔'
        statusInfo = <p className="status" style={{ color: currentStatusColor }}>{currentStatus ? currentStatus.replace('_',' ') : null} {currentStatusEmoji}</p>
      }
    } catch (e) {
      console.log('failed to parse status', e)
    }

    let authorInfo = null
    const authorLink = nip19.npubEncode(beaconData.pubkey)
    authorInfo = <p onClick={e => e.stopPropagation()}><a href={`https://njump.me/${authorLink}`} target="_blank" rel="noopener noreferrer"><small className="ellipses">Created by {ownerProfile?.content?.displayName || ownerProfile?.content?.display_name || ownerProfile?.content?.username || beaconData.pubkey}</small></a></p>

    let edit = null
    try {
      if (currentUserPubkey === beaconData.pubkey)
        edit = <FancyButton size="sm" className="chill" onClick={editPlace} style={{ float: "right", marginTop: "22px", marginRight: "-1.0rem", marginLeft: '0.25rem' }}>Edit</FancyButton>
    } catch (e) {
      console.log(e)
    }

    let share = null
    try {
      const margin = edit ? '22px 0.25rem' : '22px -1rem 0 0.25rem'
      share = <button onClick={sharePlace} style={{ float: "right", margin: margin, position: "relative" }}>
        Share
        {shared ? <Shared/> : null}
      </button>
    } catch (e) {
      console.log(e)
    }

    let sms = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sms = beaconData.content?.properties?.phone ? <button onClick={() => sendSMS(beaconData.content.properties.phone!)} style={{ float: "right", margin: "22px 0.25rem", position: "relative" }}>{isMobile ? 'Text' : 'Call'}</button> : null
    } catch(e) {
      console.log(e)
    }

    return (
      <div className="beacon__info" onClick={toggle}>
        {beaconName}
        {typeInfo}
        {statusInfo}
        <hr/>
        {beaconDescription}
        {hours}
        {authorInfo}
        {edit}
        {share}
        {sms}
      </div>
    )
  }

  const beaconClasses = `beacon ${open ? 'beacon--show' : ''}`

  return (
    <div className={beaconClasses}>
      {mapMarker}
      {open ? showBeaconInfo() : null}
    </div>
  )
}
