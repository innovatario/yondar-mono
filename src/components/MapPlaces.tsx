import { IdentityContextType, IdentityType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { ModalContextType } from '../types/ModalType'
import { ModalContext } from '../providers/ModalProvider'
import { Event, Filter } from 'nostr-tools'
import { getRelayList, pool } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { useMap, Marker } from 'react-map-gl'
import { DraftPlaceContext } from '../providers/DraftPlaceProvider'
import { DraftPlaceContextType, EventWithoutContent, Place, PlaceProperties } from '../types/Place'
import { RelayList } from '../types/NostrRelay'
import { getUniqueBeaconID } from '../libraries/NIP-33'
import { Beacon } from './Beacon'
import '../scss//MapPlaces.scss'
import { ContactList } from '../types/NostrContact'

type beaconsReducerType = {
  [key: string]: Place
}

const beaconsReducer = (state: beaconsReducerType, action: { type: string; beacon?: Place, beaconUniqueID?: string }) => {

  if (action.beacon) {
    const unique = getUniqueBeaconID(action?.beacon)
    const existing = state[unique]
    // only save the newest beacon by created_at timestamp; if this incoming beacon s older, don't save it.
    if (existing && existing.created_at > action.beacon.created_at) return state

    if (action.type === 'add') {
      return {
        ...state,
        [unique]: action.beacon  
      }
    }
  } else {
    // probably trying to remove 
    if (action.type === 'remove' && action.beaconUniqueID) {
      const newState = {...state}
      delete newState[action.beaconUniqueID]
      return newState
    }
  }

  // proceed with clear or return state without action
  switch(action.type) {
    case 'clear':
      return {}
    default:
      return state
  }
}

type Owner = Event & { content: IdentityType }
type beaconOwnersReducerType = {
  [key: string]: Owner
} 

const beaconOwnersReducer = (state: beaconOwnersReducerType, action: { type: string; owner?: Owner}) => {
  if (action.owner && action.owner.pubkey) {
    const unique = action.owner.pubkey
    if (action.type === 'add') {
      return {
        ...state,
        [unique]: action.owner
      }
    }
  }

  // proceed with save
  switch(action.type) {
    case 'clear':
      return {}
    default:
      return state
  }
}

export const MapPlaces = ({global}: {global: boolean}) => {
  const [beacons, beaconsDispatch] = useReducer(beaconsReducer, {})
  const [gotAllBeacons, setGotAllBeacons] = useState(false)
  const [beaconOwners, beaconOwnersDispatch] = useReducer(beaconOwnersReducer, {})
  const [showBeacon, setShowBeacon] = useState<string>('')
  const {position} = useGeolocationData()
  const {current: map} = useMap()
  const {identity, relays, contacts} = useContext<IdentityContextType>(IdentityContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {draftPlace, setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)

  // get all beacons
  useEffect( () => {
    beaconsDispatch({type: 'clear'})
    const contactList: ContactList = [identity.pubkey, ...Object.keys(contacts || {}) ]
    const filter: Filter<37515> = global ? {kinds: [37515]} : {kinds: [37515], authors: contactList}
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
        console.log('Failed to parse event content:', e)
      }
    })
    sub.on('eose', () => {
      setGotAllBeacons(true)
      sub.unsub()
    })
    return () => {
      sub.unsub()
    }
  }, [relays,global,contacts,identity])

  // get all beacon owner profiles
  // NOTE: some beacon owners won't have profiles! They simply haven't published one yet!
  useEffect( () => {
    const beaconPubkeys: {[key: string]: boolean} = {} 
    Object.values(beacons).forEach( beacon => {
      beaconPubkeys[beacon.pubkey] = true
    })
    const beaconOwnerList = Object.keys(beaconPubkeys)
    const profileFilter: Filter = { kinds: [0,5], authors: beaconOwnerList }
    const relayList: RelayList = getRelayList(relays, ['read'])
    const sub = pool.sub(relayList, [profileFilter])
    sub.on('event', (event) => {
      if (event.kind === 0) {
        // handle new beacon owner profile
        try {
          beaconOwnersDispatch({
            type: 'add',
            owner: {
              ...event,
              content: JSON.parse(event.content)
            }
          })
        } catch(e) {
          console.log('Failed to parse event content:', e)
        }
      } else if (event.kind === 5) {
        // handle deleted beacons
        // iterate through event's e tags to find uniqueid's (NIP-33).
        event.tags.forEach( tag => {
          if (tag[0] === 'e') {
            const uniqueID = tag[1]
            beaconsDispatch({
              type: 'remove',
              beaconUniqueID: uniqueID
            })
          }
        })
      }
    })
    sub.on('eose', () => {
      sub.unsub()
    })
    return () => {
      sub.unsub()
    }
  }, [gotAllBeacons])

  const beaconsArray = Object.values(beacons)

  beaconsArray
    // Sort first by the first elements in beaconToggleState, then by oldest to newest.
    .sort( (a, b) => {
      if (showBeacon === a.id) return -1
      return a.content.geometry.coordinates[1] - b.content.geometry.coordinates[1]
    }).reverse()

  // console.log(beaconsArray.map( b => getUniqueBeaconID(b).split('-')[0]))

  // iterate through beacon data and prepare it for map display. 
  return beaconsArray 
    // convert each beacon into a JSX Beacon Component
    .map( (beacon: Place, index ) => {
      // move map so the beacon is left of the details box
      const handleFollow = () => {
        // toggle the beacon's open state
        if (showBeacon === beacon.id) {
          setShowBeacon('')
        } else {
          setShowBeacon(beacon.id)
          if (map && position) {
            const width = window.innerWidth / 135 / 10000
            map.flyTo({
              center: [beacon.content.geometry.coordinates[0] + 0.00130 + width, beacon.content.geometry.coordinates[1] - 0.0005],
              zoom: 16,
              duration: 1000,
            })
          }
        }
      }
      // move map so the beacon is above the edit form
      const handleEdit = () => {
        if (map && position) {
          map.flyTo({
            center: [beacon.content.geometry.coordinates[0], beacon.content.geometry.coordinates[1] - 0.0005],
            zoom: 16,
            duration: 1000,
          })
        }
      }
      return (
        <Marker clickTolerance={5} key={index} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
          <Beacon
            currentUserPubkey={identity?.pubkey}
            ownerProfile={beaconOwners[beacon.pubkey]}
            relays={relays}
            modal={modal}
            beaconData={beacon}
            open={showBeacon === beacon.id}
            clickHandler={handleFollow}
            editHandler={handleEdit}
            draft={{
              draftPlace,
              setDraftPlace
            }} 
            />
        </Marker>
      )
    })
}
