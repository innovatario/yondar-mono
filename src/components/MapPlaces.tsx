import { useEffect, useReducer, useContext } from 'react'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { ModalContextType } from '../types/ModalType'
import { ModalContext } from '../providers/ModalProvider'
import { Filter } from 'nostr-tools'
import { getRelayList, pool } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { useMap } from 'react-map-gl'
import { Marker } from 'react-map-gl'
import '../scss//MapPlaces.scss'
import { DraftPlaceContext } from '../providers/DraftPlaceProvider'
import { DraftPlaceContextType, EventWithoutContent, Place, PlaceProperties } from '../types/Place'
import { RelayList } from '../types/NostrRelay'
import { getTag } from "../libraries/Nostr"
import { Beacon } from './Beacon'

// type MapPlacesProps = {
//   children?: React.ReactNode
// }

type beaconsReducerType = {
  [key: string]: Place
}

const beaconsReducer = (state: beaconsReducerType, action: { type: string; beacon: Place }) => {
  const dtag = action.beacon.tags.find(getTag("d"))
  const pubkey = action.beacon.pubkey
  const kind = action.beacon.kind
  const unique = `${dtag}-${pubkey}-${kind}`
  const existing = state[unique]
  // only save the newest beacon by created_at timestamp; if this incoming beacon s older, don't save it.
  if (existing && existing.created_at > action.beacon.created_at) return state

  // proceed with save
  switch(action.type) {
    case 'add': 
      return {
        ...state,
        [unique]: action.beacon  
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
    // get places from your relays
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
      <Marker clickTolerance={5} key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
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
