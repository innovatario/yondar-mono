import { useEffect, useReducer, useContext, useState, useMemo } from 'react'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { ModalContextType } from '../types/ModalType'
import { ModalContext } from '../providers/ModalProvider'
import { Filter, nip19 } from 'nostr-tools'
import { getRelayList, getTag, pool } from "../libraries/Nostr"
import { useGeolocationData } from "../hooks/useGeolocationData"
import { useMap, Marker, MapRef } from 'react-map-gl'
import { DraftPlaceContext } from '../providers/DraftPlaceProvider'
import { DraftPlaceContextType, EventWithoutContent, Place, PlaceProperties } from '../types/Place'
import { RelayList } from '../types/NostrRelay'
import { Beacon } from './Beacon'
import '../scss//MapPlaces.scss'
import { ContactList } from '../types/NostrContact'
import { beaconsReducer } from '../reducers/MapPlacesBeaconsReducer'
import { beaconOwnersReducer } from '../reducers/MapPlacesBeaconOwnersReducer'
import { WavyText } from './WavyText'
import { useNaddr } from '../hooks/useNaddr'
import { useLocation, useNavigate } from 'react-router-dom';
import { createNaddr } from '../libraries/draftPlace'

export const MapPlaces = ({global}: {global: boolean}) => {
  const [beacons, beaconsDispatch] = useReducer(beaconsReducer, {})
  const [gotAllBeacons, setGotAllBeacons] = useState(false)
  const [, setGotAllProfiles] = useState(false)
  const [beaconOwners, beaconOwnersDispatch] = useReducer(beaconOwnersReducer, {})
  const [showBeacon, setShowBeacon] = useState<string>('')
  const {position} = useGeolocationData()
  const {current: map} = useMap()
  const {identity, relays, contacts} = useContext<IdentityContextType>(IdentityContext)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const {draftPlace, setDraftPlace} = useContext<DraftPlaceContextType>(DraftPlaceContext)
  const { naddr, setNaddr } = useNaddr()
  const navigate = useNavigate()
  const [naddrZoom, setNaddrZoom] = useState<boolean>(false) // tells whether we are currently zooming on a beacon from a /place/:naddr URL
  const location = useLocation()

  const clearNaddr = () => {
    setNaddr('')
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard')
    }
  }

  // validate naddr, find corresponding place, and focus the map on it.
  // set up effect so when the map leaves the place, the URL is changed back to /dashboard
  useEffect(() => {
    if (gotAllBeacons && naddr && map && !naddrZoom) {
      setNaddrZoom(true)
      const dtag = nip19.decode(naddr)
      const unique = `${dtag.data.kind}:${dtag.data.pubkey}:${dtag.data.identifier}`
      const beacon = beacons[unique]

      if (beacon) {
        const CENTER_TIME = 1000
        // const { coordinates } = beacon.content.geometry
        const width = window.innerWidth / 135 / 10000
        // wait for zoom to finish, then open beacon and center map on description
        setShowBeacon(beacon.id)
        map.flyTo({
          center: [
            beacon.content.geometry.coordinates[0] + 0.00110 + width,
            beacon.content.geometry.coordinates[1] - 0.0010],
          zoom: 16, 
          duration: CENTER_TIME
        })
        // set up function to clear naddr from URL when map leaves the beacon
        setTimeout( () => {
          map.once('movestart', clearNaddr)
          setNaddrZoom(false)
        }, CENTER_TIME + 1)
      }
    }
  }, [gotAllBeacons, naddr, beacons, map])

  // get all beacons
  useEffect( () => {
    beaconsDispatch({type: 'clear'})
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
        console.log('Failed to parse event content:', e)
      }
    })
    sub.on('eose', () => {
      setGotAllBeacons(true)
    })
    return () => {
      sub.unsub()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // get all beacon owner profiles
  // get all deleted beacons
  // NOTE: some beacon owners won't have profiles! They simply haven't published one yet!
  useEffect( () => {
    const beaconPubkeys: {[key: string]: boolean} = {} // use an object to deduplicate pubkeys
    const beaconEventIDs: string[] = []
    Object.values(beacons).forEach( beacon => {
      beaconPubkeys[beacon.pubkey] = true
      beaconEventIDs.push(beacon.id)
    })
    const beaconOwnerList = Object.keys(beaconPubkeys)
    const profileFilter: Filter = { kinds: [0], authors: beaconOwnerList }
    const deletionFilter: Filter = { kinds: [5], authors: beaconOwnerList }
    const relayList: RelayList = getRelayList(relays, ['read'])
    // it makes sense to do these at the same time since we can narrow deletions by author
    const sub = pool.sub(relayList, [profileFilter, deletionFilter])
    sub.on('event', (event) => {
      // process profiles received
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
      // process deletions received
      } else if (event.kind === 5) {
        // handle deleted beacons
        // iterate through event's e tags to find uniqueid's (NIP-33).
        event.tags.forEach( tag => {
          if (tag[0] === 'a') {
            const uniqueID = tag[1]
            beaconsDispatch({
              type: 'remove',
              beaconUniqueID: uniqueID,
              deletionPubkey: event.pubkey
            })
          }
        })
      }
    })
    sub.on('eose', () => {
      setGotAllProfiles(true)
    })
    return () => {
      sub.unsub()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gotAllBeacons])

  const contactList: ContactList = useMemo( () => {
    return [identity.pubkey, ...Object.keys(contacts || {}) ]
  }, [contacts, identity.pubkey])

  // iterate through beacon data and prepare it for map display. 
  const displayBeacons = useMemo( () => {
    return Object.values(beacons)
      .sort( (a, b) => {
        if (showBeacon === a.id) return -1 // if this is the expanded beacon, show it first
        return a.content.geometry.coordinates[1] - b.content.geometry.coordinates[1] // otherwise, show beacons by smallest latitude (nearest) first
      })
      .map( (beacon: Place) => {
        // if the map feed is Friends, only display beacons from friends
        if (!global && !contactList.includes(beacon.pubkey)) return null


        const relayList: RelayList = getRelayList(relays, ['read'])
        const naddr = createNaddr(beacon.pubkey, beacon.tags.find(getTag('d'))?.[1] || "", relayList)

        const output = (
          <Marker clickTolerance={5} key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
            <Beacon currentUserPubkey={identity?.pubkey} ownerProfile={beaconOwners[beacon.pubkey]} relays={relays} beaconData={beacon} modal={modal} open={showBeacon === beacon.id} focusHandler={getFocusBeaconHandler(beacon, showBeacon, setShowBeacon, map, position, naddr, navigate, clearNaddr)} editHandler={getEditBeaconHandler(beacon, map )} draft={{draftPlace, setDraftPlace}} />
          </Marker>
        )

        return output
      })
  }, [beacons, showBeacon, setShowBeacon, global, contactList, identity?.pubkey, beaconOwners, relays, modal, map, position, draftPlace, setDraftPlace])

  if (!gotAllBeacons) return <div id="loading-message"><WavyText text="Loading Places..." /></div>
  else return displayBeacons
}

const getFocusBeaconHandler = (beacon: Place , showBeacon: string, setShowBeacon: React.Dispatch<React.SetStateAction<string>>, map: MapRef | undefined, position: GeolocationPosition | null, naddr: string, navigate: (naddr: string) => void, clearNaddr: () => void) => {
  // move map so the beacon is left of the details box
  return () => {
    // toggle the beacon's open state
    if (showBeacon === beacon.id) {
      setShowBeacon('')
    } else {
      setShowBeacon(beacon.id)
      navigate(`/place/${naddr}`)
      if (map && position) {
        const width = window.innerWidth / 135 / 10000
        map.flyTo({
          center: [beacon.content.geometry.coordinates[0] + 0.00110 + width, beacon.content.geometry.coordinates[1] - 0.0010],
          zoom: 16,
          duration: 1000,
        })
      }
    }
  }
}
const getEditBeaconHandler = (beacon: Place , map: MapRef | undefined ) => {
  // move map so the beacon is above the edit form
  return () => {
    if (map) {
      map.flyTo({
        center: [beacon.content.geometry.coordinates[0], beacon.content.geometry.coordinates[1] - 0.0015],
        zoom: 16,
        duration: 1000,
      })
    }
  }
}
