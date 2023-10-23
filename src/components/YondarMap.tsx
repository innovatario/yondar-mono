import { useState, useContext, useEffect } from 'react'
import { Me } from './Me'
import { MapPlaces } from './MapPlaces'
import { Cursor } from './Cursor'
import Map, { ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { FollowTarget } from '../types/Follow'
import { ModalContextType } from "../types/ModalType"
import { ModalContext } from "../providers/ModalProvider"
import { FeedToggle } from './FeedToggle'
import usePersistedState from '../hooks/usePersistedState'
import { GeoChat } from './GeoChat'
import { MapGeoChat } from './MapGeoChat'
import { GeoChatButton } from './GeoChatButton'
import { ModeContext } from '../providers/ModeProvider'
import { AddPlace } from './AddPlace'
import { AddButton } from './AddButton'
import { ZoomOutButton } from './ZoomOutButton'

type YondarMapProps = {
  children?: React.ReactNode
}

export const YondarMap = ({ children }: YondarMapProps) => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const {position, cursorPosition, setCursorPosition} = useGeolocationData()
  const [zoom, setZoom] = useState<number>(1)
  const [follow, setFollow] = useState<FollowTarget>(null)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [globalFeed, setGlobalFeed] = usePersistedState<boolean>('feed', true)
  const [geoChat, setGeoChat] = useState<boolean>(false)
  const [addPlace, setAddPlace] = useState<boolean>(false)
  const {mode, setMode} = useContext(ModeContext)

  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setFollow(null)
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }

  function handleClick(event: mapboxgl.MapLayerMouseEvent) {
    if ((event.originalEvent?.target as HTMLElement)?.tagName === "CANVAS") {
      // we touched the map. Place the cursor.
      if (modal?.placeForm === true) {
        // if the place form is open, don't move the cursor
        // close the place form
        modal.setPlaceForm(false)
      } else { 
        setCursorPosition(event.lngLat)
      }
    }
  }

  const toggleFeed = () => {
    setGlobalFeed(!globalFeed)
  }

  useEffect(() => {
    if (mode === 'add') {
      setAddPlace(true)
      setGeoChat(false)
    }
    if (mode === 'chat') {
      setGeoChat(true)
      setAddPlace(false)
    }
    if (mode === null){
      setGeoChat(false)
      setAddPlace(false)
    }

  }, [mode])

  const toggleAddPlace = () => {
    if (mode === 'add') {
      setMode(null)
    } else {
      setMode('add')
    }
  }

  const toggleGeoChat = () => {
    if (mode === 'chat') {
      setMode(null)
    } else {
      setMode('chat')
    }
  }

  const mapLongitude = position && follow === "USER" ? position?.coords.longitude : longitude
  const mapLatitude = position && follow === "USER" ? position?.coords.latitude : latitude

  return (
    <>
    <Map
      projection={'globe'}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API}
      longitude={mapLongitude}
      latitude={mapLatitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '100svh', cursor: 'crosshair!important' }}
      onMove={e => setViewState(e.viewState)}
      onClick={handleClick}
      mapStyle='mapbox://styles/innovatar/clnw247z1001f01ri43tacxbg'
    >
      {/* { !triggerGeo ? <MapClickHint longitude={longitude} latitude={latitude} /> : null } */}
      <Cursor>
        { mode === 'add' ? <AddPlace/> : null }
      </Cursor>
      <Me setFollow={setFollow}/>
      <MapPlaces global={globalFeed}/>
      {/* { modal?.placeForm ? null : <MapPlaces global={globalFeed}/> } */}
      <FeedToggle globalFeed={globalFeed} toggleFeed={toggleFeed}/>
      { children }
      { mode === 'chat' ? <MapGeoChat zoom={zoom} mapLngLat={[mapLongitude, mapLatitude]}/> : null}
      {!modal?.placeForm && zoom > 7 ? <ZoomOutButton show={true} /> : null }
    </Map>
    {!modal?.placeForm && (cursorPosition || mode === 'chat') ? <GeoChatButton show={geoChat} onClick={toggleGeoChat}/> : null }
    {!modal?.placeForm && (cursorPosition || mode === 'add') ? <AddButton show={addPlace} onClick={toggleAddPlace}/> : null }
    {mode === 'chat' ? <GeoChat show={geoChat} mapLngLat={[mapLongitude, mapLatitude]} zoom={zoom}/> : null }
    </>
  )
}
