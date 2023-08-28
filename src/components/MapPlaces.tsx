import { useState, useEffect, useReducer, useContext } from 'react'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { ModalContextType, ModalType } from '../types/ModalType'
import { ModalContext } from '../providers/ModalProvider'
import { Filter } from 'nostr-tools'
import { getRelayList, pool } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { useMap } from 'react-map-gl'
import { Marker } from 'react-map-gl'
import '../scss//MapPlaces.scss'
import { isOpenNow } from '../libraries/decodeDay'
import { DraftPlaceContext } from '../providers/DraftPlaceProvider'
import { DraftPlaceContextType, EventWithoutContent, Place, PlaceProperties } from '../types/Place'
import { beaconToDraftPlace } from '../libraries/draftPlace'
import { CursorPositionType } from '../providers/GeolocationProvider'
import { RelayList, RelayObject } from '../types/NostrRelay'

// type MapPlacesProps = {
//   children?: React.ReactNode
// }

const beaconsReducer = (state: object, action: { type: string; beacon: { id: string} }) => {
  switch(action.type) {
    case 'add': 
      return {
        ...state,
        [action.beacon.id]: action.beacon  
      }
    default:
      return state
  }
}

export const MapPlaces = () => {
  const [beacons, beaconsDispatch] = useReducer(beaconsReducer, {})
  const {position} = useGeolocationData()
  const {current: map} = useMap()
  const {identity, relays} = useContext<IdentityContextType>(IdentityContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {draftPlace, setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)

  useEffect( () => {
    const filter: Filter<37515> = {kinds: [37515]}
    const relayList: RelayList = getRelayList(relays, ['read'])
    const sub = pool.sub(relayList, [filter])
    sub.on('event', (event) => {
      let placeProperties: PlaceProperties
      try {
        placeProperties = JSON.parse(event.content)
        if (!placeProperties.geometry || !placeProperties.geometry.coordinates) throw new Error('No coordinates')
        // if any events have malformed coordinates using an object with lat or lng properties, convert them to array/mapbox format
        if (!Array.isArray(placeProperties.geometry.coordinates)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const {lng, lat} = placeProperties.geometry.coordinates as any
          const lngLatArray: [number, number] = [lng, lat]
          placeProperties.geometry.coordinates = lngLatArray
        }
        const foundEvent: EventWithoutContent = {
          ... event
        }
        const place: Place = {
          ... foundEvent,
          content: placeProperties as PlaceProperties
        }

        beaconsDispatch({
          type: 'add',
          beacon: place 
        })
      } catch (e) {
        // console.log('Failed to parse event content:', e)
      }
    })
  }, [relays])

  return Object.values(beacons).map( (beacon: Place ) => {
    // move map so the beacon is left of the details box
    const handleFollow = () => {
      if (map && position) {
        map.flyTo({
          center: [beacon.content.geometry.coordinates[0] + 0.0015, beacon.content.geometry.coordinates[1]],
          zoom: 16,
          duration: 1000,
        })
      }
    }
    // move map so the beacon is above the edit form
    const handleEdit = () => {
      if (map && position) {
        map.flyTo({
          center: [beacon.content.geometry.coordinates[0], beacon.content.geometry.coordinates[1] - 0.0015],
          zoom: 16,
          duration: 1000,
        })
      }
    }
    return (
      <Marker key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
        <Beacon
          currentUserPubkey={identity?.pubkey}
          relays={relays}
          modal={modal}
          beaconData={beacon}
          clickHandler={handleFollow}
          editHandler={handleEdit}
          draft={{
            draftPlace,
            setDraftPlace
          }} />
      </Marker>
    )
  })
}

type BeaconProps = {
  currentUserPubkey: string | undefined,
  relays: RelayObject,
  beaconData: Place,
  modal: ModalType,
  clickHandler: () => void,
  editHandler: () => void,
  draft: DraftPlaceContextType
}

const Beacon = ({currentUserPubkey, relays, beaconData, modal, clickHandler, editHandler, draft}: BeaconProps) => {
  const [show, setShow] = useState<boolean>(false)
  const [beaconProfilePicture, setBeaconProfilePicture] = useState<string>('')
  const {setDraftPlace} = draft 
  const {setCursorPosition} = useGeolocationData()
  const relayList: RelayList = getRelayList(relays, ['read'])

  useEffect( () => {
    // get profile for beacon owner (pubkey) by querying for most recent kind 0 (profile)
    const filter: Filter = {kinds: [0], authors: [beaconData.pubkey]}
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

  const mapMarker = <div className="beacon__marker" onClick={toggle}>{<MapPin color={`#${beaconData.pubkey.substring(0,6)}`} image={beaconProfilePicture}/>}</div>

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
      hours = <p className="hours">{ isOpenNow(beaconData.content.properties.hours) ? "🟢 Open Now" : "⛔ Not Open Right Now"}<br/><small>{beaconData.content.properties.hours}</small></p>
    } catch (e) {
      // console.log('failed to parse hours', e)
    }

    let edit = null
    try {
      if (currentUserPubkey === beaconData.pubkey)
        edit = <button onClick={editPlace} style={{float: "right", marginTop: "1.5rem", marginRight: "-1.0rem"}}>Edit</button>
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

  return (
      <div className="beacon">
        {mapMarker}
        { show ? showBeaconInfo() : null }
      </div>
  )
}

const MapPin = ({ color, image }: {color: string, image: string}) => (
  <svg width="40" height="60" viewBox="0 0 40 60">
    
    <defs>
      <mask id="pinMask">
        <rect x="0" y="0" width="40" height="60" fill="black"/>
        <circle cx="20" cy="20" r="15" fill="white"/>
      </mask>
    </defs>

    <path 
      fill={color}
      d="M20 8c-7.732 0-14 6.268-14 14 0 15.464 14 30 14 30s14-14.536 14-30c0-7.732-6.268-14-14-14z"
    />

    <image
      x="5" y="5" width="30" height="30"
      preserveAspectRatio="xMidYMid slice"  
      xlinkHref={image}
      mask="url(#pinMask)"
    />

  </svg>
)