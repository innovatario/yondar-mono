import { useState, useContext, useEffect, useRef } from 'react'
import { Me } from './Me'
import { MapPlaces } from './MapPlaces'
import { Cursor } from './Cursor'
import Map, { Layer, MapRef, PointLike, Source, ViewState, ViewStateChangeEvent } from 'react-map-gl'
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
import { Directions } from './Directions'
import mapboxgl, { LngLatLike } from 'mapbox-gl'
import { SelectedPlaces } from './SelectedPlaces'
import { GeolocationContext, GeolocationContextType } from '../providers/GeolocationProvider'

type YondarMapProps = {
  children?: React.ReactNode
}

export const YondarMap = ({ children }: YondarMapProps) => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const {position, cursorPosition, setCursorPosition} = useContext<GeolocationContextType>(GeolocationContext)
  const [zoom, setZoom] = useState<number>(1)
  const [follow, setFollow] = useState<FollowTarget>(null)
  const {modal} = useContext<ModalContextType>(ModalContext)
  const [globalFeed, setGlobalFeed] = usePersistedState<boolean>('feed', true)
  const [geoChat, setGeoChat] = useState<boolean>(false)
  const [addPlace, setAddPlace] = useState<boolean>(false)
  const {mode, setMode} = useContext(ModeContext)
  const [selectedFeatures, setSelectedFeatures] = useState<mapboxgl.MapboxGeoJSONFeature[]>([]) // TODO: type this as [Feature
  const mapRef = useRef<MapRef>(null)

  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setFollow(null)
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }

  // when the cursor moves or the map moves/zooms, update the selected Places
  useEffect( () => {
    if (cursorPosition === null) {
      console.log('cursorPosition null')
      return
    }
    if (mapRef.current === null) {
      console.log('mapRef.current null')
      return
    }
    // Select Places within the cursor's bounding box
    // set the bounding box for the cursor
    const cursorRadiusInPixels = 20 
    let zoomAdjust = 0 // on very high zooms we need to increase the area of the selection or else it may miss targets that should obviously be selected
    if (zoom >= 18) zoomAdjust = (zoom - 18) * 20

    // Assuming cursorPosition is a [longitude, latitude] array
    const cursorScreenPosition = mapRef.current.project(cursorPosition as LngLatLike)

    const cursorBox = [
      [cursorScreenPosition.x - cursorRadiusInPixels - zoomAdjust, cursorScreenPosition.y + cursorRadiusInPixels + zoomAdjust + 10], // bottom left
      [cursorScreenPosition.x + cursorRadiusInPixels + zoomAdjust, cursorScreenPosition.y - cursorRadiusInPixels - zoomAdjust - 10] // top right
    ]

    // Get the features within the cursor's bounding box
    const features = mapRef.current.queryRenderedFeatures(cursorBox as [PointLike, PointLike], {layers: ['beacons']})

    // This sort messes up the map. Probably because SelectedPlaces is a child of the map component.
    // features.sort((a, b) => {
    //   // sort by name
    //   if (!a.properties || !b.properties) return 0
    //   if (a.properties.name.toUpperCase() < b.properties.name.toUpperCase()) return -1
    //   return 1
    // })
    setSelectedFeatures(features)
    // console.log('Selected features:', features)
  },[cursorPosition, zoom, latitude, longitude])

  function handleMove(event: ViewStateChangeEvent) {
    setViewState(event.viewState)
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

  const projectionName = !cursorPosition ? zoom < 6 ? 'globe' : 'mercator' : 'globe'
  const projection = {name: projectionName} as mapboxgl.Projection


  // console.log(projection)

  return (
    <>
    <Map
      ref={mapRef}
      projection={projection}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_API}
      longitude={mapLongitude}
      latitude={mapLatitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '100svh', cursor: 'crosshair!important' }}
      onMove={handleMove}
      onClick={handleClick}
      mapStyle='mapbox://styles/innovatar/clnw247z1001f01ri43tacxbg'
    >
      <Directions/>
      <Cursor>
        { mode === 'add' ? <AddPlace/> : null }
      </Cursor>
      <Me setFollow={setFollow}/>
      <MapPlaces global={globalFeed}/>
      <FeedToggle globalFeed={globalFeed} toggleFeed={toggleFeed}/>
      { children }
      { mode === 'chat' ? <MapGeoChat zoom={zoom} mapLngLat={[mapLongitude, mapLatitude]}/> : null}
      {!modal?.placeForm && zoom > 5 ? <ZoomOutButton show={true} /> : null }
      {mode === null && selectedFeatures.length && cursorPosition ? <SelectedPlaces set={selectedFeatures} map={mapRef}/> : null }
    </Map>
    {!modal?.placeForm && (cursorPosition || mode === 'chat') ? <GeoChatButton show={geoChat} onClick={toggleGeoChat}/> : null }
    {!modal?.placeForm && (cursorPosition || mode === 'add') ? <AddButton show={addPlace} onClick={toggleAddPlace}/> : null }
    {mode === 'chat' ? <GeoChat show={geoChat} mapLngLat={[mapLongitude, mapLatitude]} zoom={zoom}/> : null }
    </>
  )
}
