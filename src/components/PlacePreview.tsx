/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useContext } from 'react'
import { getRelayList, pool } from "../libraries/Nostr"
import { NaddrContext } from '../providers/NaddrProvider'
import { Filter, nip19 } from 'nostr-tools'
import { RelayList } from '../types/NostrRelay'
import { IdentityContextType } from '../types/IdentityType'
import { IdentityContext } from '../providers/IdentityProvider'
import { Place } from '../types/Place'
import { Map, Marker, ViewState } from 'react-map-gl'
import { PreviewBeacon } from './PreviewBeacon'
import { WavyText } from './WavyText'
import { SignInButton } from './SignInButton'
import { SignUpButton } from './SignUpButton'
import { Owner } from '../reducers/MapPlacesBeaconOwnersReducer'
import '../scss/PlacePreview.scss'

export const PlacePreview = () => {
  const { naddr } = useContext(NaddrContext)
  const { relays } = useContext<IdentityContextType>(IdentityContext)
  const [place, setPlace] = useState<Place | null>(null)
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(15)
  const [deleted, setDeleted] = useState<boolean>(false)
  const [display, setDisplay] = useState<boolean>(false)
  const [owner, setOwner] = useState<Owner | null>(null)
  const [kind, setKind] = useState<number>(0)
  const [pubkey, setPubkey] = useState<string>('')
  const [identifier, setIdentifier] = useState<string>('')


  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }

  useEffect(() => {
    const getPlace = async () => {
      let decodedNaddr
      if (naddr) {
        decodedNaddr = nip19.decode(naddr).data
        const { kind, pubkey, identifier } = decodedNaddr as nip19.AddressPointer
        setKind(kind)
        setPubkey(pubkey)
        setIdentifier(identifier)
        const filter: Filter<37515> = { kinds: [37515], authors: [pubkey], "#d": [identifier]}
        const relayList: RelayList = getRelayList(relays, ['read'])
        const place = await pool.list(relayList, [filter])
        // sub.on('event', (event) => {
        //   console.log('place event', event)
        // })
        // console.log('preview', relayList, filter)
        // if there are multiples, sort by created_at and take the most recent
        const only = place.sort((a,b) => b.created_at - a.created_at)[0]
        try {
          const properties = JSON.parse(only.content)
          const loadedPlace: Place = {
            ...only,
            content: properties
          }
          setPlace(loadedPlace)
        } catch (e) {
          console.log('error', e)
        }
      } else {
        console.log('no naddr')
      }
    }
    getPlace()
  },[naddr, relays])

  useEffect(() => {
    if (place) {
      setLongitude(place?.content?.geometry?.coordinates[0])
      setLatitude(place?.content?.geometry?.coordinates[1])
    }
  },[place])

  useEffect( () => {
    if (!place) return
    const profileFilter: Filter = { kinds: [0], authors: [place.pubkey]}
    const deletionFilter: Filter = { kinds: [5], authors: [place.pubkey]}
    const relayList: RelayList = getRelayList(relays, ['read'])
    // it makes sense to do these at the same time since we can narrow deletions by author
    const sub = pool.sub(relayList, [profileFilter, deletionFilter])
    sub.on('event', (event) => {
      // process profiles received
      if (event.kind === 0) {
        // handle new beacon owner profile
        try {
          setOwner(JSON.parse(event.content))
        } catch(e) {
          console.log('Failed to parse event content:', e)
        }
      // process deletions received
      } else if (event.kind === 5) {
        // handle deleted beacons
        // iterate through event's e tags to find uniqueid's (NIP-33).
        event.tags.forEach( tag => {
          if (tag[0] === 'a') {
            const uniqueID = `${kind}:${pubkey}:${identifier}`
            if (tag[1] === uniqueID) {
              setDeleted(true)
            }
          }
        })
      }
    })
    sub.on('eose', () => {
      if (!deleted) {
        setDisplay(true)
      }
    })
    return () => {
      sub.unsub()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place])

  if (display) {
    return (
      <>
      <div className="faq mt-0">
        <p className="receive">Here is the place you're looking for!</p>
      </div>
      <div className="component-placepreview">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_API}
          longitude={longitude}
          latitude={latitude}
          zoom={zoom}
          style={{ maxWidth: '100%', cursor: 'crosshair!important' }}
          onMove={e => setViewState(e.viewState)}
          mapStyle='mapbox://styles/innovatar/ckg6zpegq44ym19pen438iclf'
          scrollZoom={false}
        >
          <Marker longitude={place!.content?.geometry?.coordinates[0]} latitude={place!.content?.geometry?.coordinates[1]} offset={[-20,-52]} anchor={'center'}>
            <PreviewBeacon coords={[longitude, latitude]} ownerProfile={owner} beaconData={place!}/>
          </Marker>
        </Map>
      </div>
      <br/>
      <div className="button-row">
        <SignInButton/><br/><SignUpButton/>
      </div>
      <div className="faq mb-0">
        <p className="receive fullwidth">
          👆 Log in to start interacting &amp; creating places!<br/>
        </p>
      </div>
      </>
    )
  }

  return <><WavyText text="Loading Place..."/></>
}