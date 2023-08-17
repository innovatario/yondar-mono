import { useState, useEffect, useReducer } from 'react'
import { Event, Filter } from 'nostr-tools'
import { defaultRelays, pool } from "../libraries/Nostr"
import { BeaconCollection } from "../types/Beacon"
import { Marker } from 'react-map-gl'
import '../scss//MapPlaces.scss'

type MapPlacesProps = {
  children?: React.ReactNode
}

const beaconsReducer = (state, action) => {
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

export const MapPlaces = ({ children }: MapPlacesProps) => {
  const [beacons, beaconsDispatch] = useReducer(beaconsReducer, {})

  useEffect( () => {
    const filter: Filter = {kinds: [37515]}
    const sub = pool.sub(defaultRelays, [filter])
    sub.on('event', (event) => {
      try {
        event.content = JSON.parse(event.content)
        // console.log('found beacon', event.tags[0][1])
        if (!event.content.geometry || !event.content.geometry.coordinates) throw new Error('No coordinates')
        beaconsDispatch({
          type: 'add',
          beacon: event
        })
      } catch (e) {
        // console.log('Failed to parse event content:', e)
      }
    })
  }, [])

  return Object.values(beacons).map( (beacon) => {
    return (
      <Marker key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
        <Beacon beaconData={beacon}/>
      </Marker>
    )
  })
}

type BeaconProps = {
  beaconData: Event
}

const Beacon = ({beaconData}: BeaconProps) => {
  const [show, setShow] = useState<boolean>(false)
  const toggle = () => setShow(!show)

  // get profile for beacon owner (pubkey) by querying for most recent kind 0 (profile)
  const filter: Filter = {kinds: [0], authors: [beaconData.pubkey]}
  const profileSub = pool.sub(defaultRelays, [filter])
  profileSub.on('event', (event) => {
    console.log('profile',event)
    // setBeaconProfilePicture(event)
  })

  const mapMarker = <div className="beacon__marker">{<MapPin color={`#${beaconData.pubkey.substring(0,6)}`} image={"https://avatars.githubusercontent.com/u/99223753?s=400&u=a5c6e84e34485e3ebbf93c9cd4ae2e85ef0e293c&v=4"}/>}</div>

  const showBeaconCreator = async () => {
    return null
  }

  const showBeaconInfo = () => {
    try {
      return (
        <div className="beacon__info">
          <h2>{beaconData.content.properties.name}</h2>
          <p>{beaconData.content.properties.description}</p>
        </div>
      )
    } catch(e) {
      console.log('beacon was malformed, skip rendering',e)
    }
  }

  return (
      <div className="beacon" onClick={toggle}>
        {mapMarker}
        { show ? showBeaconInfo() : null }
      </div>
  )
}

const MapPin = ({ color, image }) => (
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