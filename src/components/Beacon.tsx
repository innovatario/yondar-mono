import { useState, useMemo, useEffect, useContext } from 'react'
import { ModalType } from '../types/ModalType'
import { Event, nip19 } from 'nostr-tools'
import { getRelayList } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { formatTimes, isOpenNow } from '../libraries/decodeDay'
import { DraftPlaceContextType, Place } from '../types/Place'
import { beaconToDraftPlace } from '../libraries/draftPlace'
import { CursorPositionType } from '../providers/GeolocationProvider'
import { IdentityContextType, IdentityType } from '../types/IdentityType'
import { RelayList } from '../types/NostrRelay'
import { MapPin } from './MapPin'
import { FancyButton } from './FancyButton'
import { Shared } from './Shared'
import { ModeContext } from '../providers/ModeProvider'
import { useNavigationTarget } from '../hooks/useNavigationTarget'
import { TbNavigationFilled as NavIcon } from 'react-icons/tb'
import { IdentityContext } from '../providers/IdentityProvider'
import { Nip05Verifier } from './Nip05Verifier'
import { useNavigate } from 'react-router-dom'
import { freshDefaultPlace } from '../libraries/defaultPlace'

type BeaconProps = {
  currentUserPubkey: string | undefined
  ownerProfile: (Event & {content: IdentityType }) | undefined
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

export const Beacon = ({ currentUserPubkey, ownerProfile, beaconData, modal, open, focusHandler, editHandler, draft }: BeaconProps) => {
  const [shared, setShared] = useState(false)
  const { setDraftPlace } = draft
  const { position, setCursorPosition } = useGeolocationData()
  const {relays} = useContext<IdentityContextType>(IdentityContext)
  const relayList: RelayList = getRelayList(relays, ['read'])
  const picture = ownerProfile?.content?.picture
  const {setMode} = useContext(ModeContext)
  const {setTarget} = useNavigationTarget()
  const navigate = useNavigate()

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
    toggle()
    editHandler()
    // set cursor to beacon's current coordinates
    const lnglat: CursorPositionType = {
      lng: beaconData.content.geometry.coordinates[0],
      lat: beaconData.content.geometry.coordinates[1]
    }
    setCursorPosition(lnglat)
    // load place data into modal 
    let newPlace
    try {
      newPlace = beaconToDraftPlace(beaconData, relayList)
    } catch (e) {
      console.warn("Place's data was invalid; could not load to edit.",e,beaconData)
      newPlace = freshDefaultPlace()
    }
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

  const handleShowProfile = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    toggle()
    navigate(`/user/${nip19.npubEncode(beaconData.pubkey)}`)
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
    let tele = null
    if (beaconData.content?.properties?.phone) tele = <a href={`tel:${beaconData.content.properties.phone}`}>{beaconData.content.properties.phone}</a>

    let authorInfo = null
    authorInfo = 
      <p onClick={handleShowProfile}>
          <small className="ellipses fake-link">Created by {ownerProfile?.content?.displayName || ownerProfile?.content?.display_name || ownerProfile?.content?.username || beaconData.pubkey}</small>
        <small><Nip05Verifier pubkey={ownerProfile?.pubkey} nip05Identifier={ownerProfile?.content?.nip05} /></small>
      {/* could add here a lud16 button  */}
      {/* <Lud16Account lud16={ownerProfile?.content.lud16} /> */}
      </p>

    let edit = null
    try {
      if (currentUserPubkey === beaconData.pubkey)
        edit = <FancyButton size="sm" className="chill" onClick={editPlace}>Edit</FancyButton>
    } catch (e) {
      console.log(e)
    }

    let share = null
    try {
      share = <button className="normal-button" onClick={sharePlace}>
        Share
        {shared ? <Shared/> : null}
      </button>
    } catch (e) {
      console.log(e)
    }

    let sms = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sms = beaconData.content?.properties?.phone ? <button className="normal-button" onClick={(e) => { e.stopPropagation(); sendSMS(beaconData.content.properties.phone!)}}>{isMobile ? 'Text us' : 'Call us'}</button> : null
    } catch(e) {
      console.log(e)
    }

    let nav = null
    try {
      nav = <button className="normal-button" onClick={ () => {setTarget(beaconData.content.geometry.coordinates); toggle()}}>Directions <NavIcon color=""/></button>
    } catch(e) {
      console.log(e)
    }

    return (
      <>
      <div className="beacon__info" onClick={toggle}>
        {beaconName}
        {typeInfo}
        {statusInfo}
        <hr/>
        {beaconDescription}
        {hours}
        {tele}
        {authorInfo}
      </div>
      <div className="beacon__actions">
        {edit}
        {share}
        {sms}
        {position ? nav : null}
      </div>
      </>
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
