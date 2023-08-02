import { useState, useEffect } from 'react'
import { Filter } from 'nostr-tools'
import { defaultRelays, pool } from "../libraries/Nostr"
import { BeaconCollection } from "../types/Beacon"
import { Marker } from 'react-map-gl'

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
      <Marker key={beacon.id} longitude={beacon.content.geometry.coordinates[0]} latitude={beacon.content.geometry.coordinates[1]} offsetLeft={-20} offsetTop={-10}>
        <div className="beacon">📍</div>
      </Marker>
    )
  })
}