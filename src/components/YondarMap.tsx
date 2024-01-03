import { useState, useContext, useEffect, useRef } from 'react'
import { Me } from './Me'
import { MapPlaces } from './MapPlaces'
import { Cursor } from './Cursor'
import Map, { Layer, PointLike, Source, ViewState } from 'react-map-gl'
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
import mapboxgl, { LngLat, LngLatLike, Point } from 'mapbox-gl'
import { Position } from 'geojson'

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
  const mapRef = useRef<mapboxgl.Map>(null)

  // debug cursorBox
  const [cursorGeoJSON, setCursorGeoJSON] = useState<GeoJSON.Feature<GeoJSON.Polygon>>()
  // if (mapRef.current) console.log(mapRef.current.getProjection())

  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setFollow(null)
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }

  function handleClick(event: mapboxgl.MapLayerMouseEvent) {
  console.log('zoom', zoom)
    if ((event.originalEvent?.target as HTMLElement)?.tagName === "CANVAS") {
      // we touched the map. Place the cursor.
      if (modal?.placeForm === true) {
        // if the place form is open, don't move the cursor
        // close the place form
        modal.setPlaceForm(false)
      } else { 
        setCursorPosition(event.lngLat)

        // Calculate the bounding box for the cursor
        const cursorRadiusInPixels = 20 // Half of the cursor's diameter
        let zoomAdjust = 0 // on very high zooms we need to increase the area of the selection or else it may miss targets that should obviously be selected
        if (zoom >= 18) zoomAdjust = (zoom - 18) * 20
        // zoomAdjust = 0
        const cursorBox = [
            [event.point.x - cursorRadiusInPixels - zoomAdjust, event.point.y + cursorRadiusInPixels + zoomAdjust], // bottom left
            [event.point.x + cursorRadiusInPixels + zoomAdjust, event.point.y - cursorRadiusInPixels - zoomAdjust]// top right
          ]

        const topLeftPoint = new Point(cursorBox[0][0], cursorBox[1][1])
        const bottomRightPoint = new Point(cursorBox[1][0], cursorBox[0][1])
        const topLeft = event.target.unproject(topLeftPoint)
        const bottomRight = event.target.unproject(bottomRightPoint)
        const cursorBoundsArray = [
          [topLeft.lng, topLeft.lat],
          [bottomRight.lng, topLeft.lat],
          [bottomRight.lng, bottomRight.lat],
          [topLeft.lng, bottomRight.lat],
          [topLeft.lng, topLeft.lat]
        ] as Position[]
        const cursorBoundsGeoJSON = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [cursorBoundsArray]
          },
          properties: {
            name: `Cursor`
          }
        } as GeoJSON.Feature<GeoJSON.Polygon>

        setCursorGeoJSON(cursorBoundsGeoJSON)

        // console.log('mapRef', mapRef)
        // console.log('event', event.lngLat)

        // Get the features within the cursor's bounding box
        // const features = event.target.queryRenderedFeatures(cursorBox as [PointLike, PointLike], {layers: ['beacons']})
        if (mapRef.current) {
          const features = mapRef.current.queryRenderedFeatures(cursorBox as [PointLike, PointLike], {layers: ['beacons']})

          if (features.length > 0) {
            const feature = features[0] // Get the first feature
            const coordinates = (feature.geometry as GeoJSON.Point).coordinates as LngLatLike // Get the feature's geographical coordinates

            // Convert the geographical coordinates to screen coordinates
            const screenCoordinates = mapRef.current.project(coordinates)

            console.log('Screen coordinates:', screenCoordinates)
          }
          
          // Handle the selected features
          console.log('Selected features:', features, cursorBox[0], cursorBox[1])
        }

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
      ref={mapRef}
      projection={zoom < 6 ? 'globe' : 'mercator'}
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
      <Directions/>
      <Cursor>
        { mode === 'add' ? <AddPlace/> : null }
      </Cursor>
      <Me setFollow={setFollow}/>
      <MapPlaces global={globalFeed}/>
      
      <Source id="cursor" type="geojson" data={cursorGeoJSON}>
        <Layer id="cursor-fill" type="fill" source="cursor" paint={{'fill-color': '#fff', 'fill-opacity': 0.9}} beforeId='beacons' />
      </Source>

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
