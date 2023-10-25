import { useEffect, useMemo } from 'react'
import { useMap } from 'react-map-gl'
import { nip19 } from 'nostr-tools'
import { isOpenNow } from '../libraries/decodeDay'
import { IdentityType } from '../types/IdentityType'
import { MapPin } from './MapPin'
import { Place } from '../types/Place'

type PreviewBeaconProps = {
  ownerProfile: IdentityType | null
  beaconData: Place
  coords: [number, number]
}
export const PreviewBeacon = ({coords, ownerProfile, beaconData}: PreviewBeaconProps) => {
  const {current: map} = useMap()
  const picture = ownerProfile?.picture

  console.log(ownerProfile)

  // center on the beacon + description on load.
  useEffect(() => {
    console.log('fly',map)
    map?.flyTo({
      center: [coords[0] + 0.0032, coords[1] - 0.0008],
      zoom: 15,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  const mapMarker = useMemo( () => {
    return (
      <div className="beacon__marker"><MapPin color={`#${beaconData.pubkey.substring(0, 6)}`} image={picture || ''} /></div>
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picture])

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
              "🟢 Open Now" : "💤 Not Open Right Now"
              <br />
              <small>{beaconData.content.properties.hours}</small>
            </>
          : null
        : null
      }</p>
    } catch (e) {
      // console.log('failed to parse hours', e)
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
    authorInfo = <p onClick={e => e.stopPropagation()}><a href={`https://njump.me/${authorLink}`} target="_blank" rel="noopener noreferrer"><small className="ellipses">Created by {ownerProfile?.displayName || ownerProfile?.display_name || ownerProfile?.username || beaconData.pubkey}</small></a></p>

    return (
      <div className="beacon__info">
        {beaconName}
        {typeInfo}
        {statusInfo}
        <hr/>
        {beaconDescription}
        {hours}
        {authorInfo}
      </div>
    )
  }

  const beaconClasses = `beacon beacon--show`

  return (
    <div className={beaconClasses}>
      {mapMarker}
      {showBeaconInfo()}
    </div>
  )
}
