import { useState, useEffect } from 'react'
import { Event, Filter } from 'nostr-tools'
import { defaultRelays, pool } from "../libraries/Nostr"
import { BeaconCollection } from "../types/Beacon"
import { Marker } from 'react-map-gl'
import '../scss//MapPlaces.scss'

type MapPlacesProps = {
  children?: React.ReactNode
}

export const MapPlaces = ({ children }: MapPlacesProps) => {
  const [beacons, setBeacons] = useState<BeaconCollection>({})

  useEffect( () => {
    const filter: Filter = {kinds: [37515]}
    const sub = pool.sub(defaultRelays, [filter])
    sub.on('event', (event) => {
      try {
        event.content = JSON.parse(event.content)
        console.log(event)
        if (!event.content.geometry || !event.content.geometry.coordinates) throw new Error('No coordinates')
        const updatedBeacons = {...beacons, [event.id]: event}
        setBeacons(updatedBeacons)
      } catch (e) {
        // console.log('Failed to parse event content:', e)
      }
    })
  }, [])

  return Object.values(beacons).map( (beacon) => {
    return (
      <Marker key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offset={[-10,-20]} anchor={'center'}>
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

  const mapMarker = <div className="beacon__marker">📍</div>

  const showBeaconInfo = () => {
    return (
      <div className="beacon__info">
        <h2>{beaconData.content.properties.name}</h2>
        <p>{beaconData.content.properties.description}</p>
      </div>
    )
  }

  return (
      <div className="beacon" onClick={toggle}>
        {mapMarker}
        { show ? showBeaconInfo() : null }
      </div>
  )
}