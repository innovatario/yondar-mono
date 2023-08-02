import { useState } from 'react'
import { Me } from './Me'
import { MapPlaces } from './MapPlaces'
import { Cursor } from './Cursor'
import Map, { ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useGeolocationData } from '../hooks/useGeolocationData'
import { FollowTarget } from '../types/Follow'

type YondarMapProps = {
  children?: React.ReactNode
}

export const YondarMap = ({ children }: YondarMapProps) => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const [cursorPosition, setCursorPosition] = useState<{lng: number, lat: number}>({lng: longitude, lat: latitude})
  const [zoom, setZoom] = useState<number>(1)
  const [triggerGeo, setTriggerGeo] = useState<boolean>(false)
  const [follow, setFollow] = useState<FollowTarget>(null)
  const {position} = useGeolocationData()

  function setViewState(viewState: ViewState) {
    // unlock map, we moved the map by interaction
    setFollow(null)
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
    // user has interacted with map, so request geolocation
    if (!triggerGeo) setTriggerGeo(true)
  }

  function handleClick(event: mapboxgl.MapLayerMouseEvent) {
    if (!triggerGeo) setTriggerGeo(true)
    console.log(event.originalEvent?.target?.tagName)
    if (event.originalEvent?.target?.tagName === "CANVAS") {
      // we touched the map. Place the cursor.
      setCursorPosition(event.lngLat)
    }
  }

  const mapLongitude = position && follow === "USER" ? position?.coords.longitude : longitude
  const mapLatitude = position && follow === "USER" ? position?.coords.latitude : latitude

  return (
    <>
    <Map
      mapboxAccessToken='pk.eyJ1IjoiaW5ub3ZhdGFyIiwiYSI6ImNrZW0wZWwybjAyYnUyeW85bW4za3dtNDUifQ.xa1351lJ3mZH1P9c1fFsGg'
      longitude={mapLongitude}
      latitude={mapLatitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '100vh' }}
      onMove={e => setViewState(e.viewState)}
      onClick={handleClick}
      mapStyle='mapbox://styles/innovatar/ckg6zpegq44ym19pen438iclf'
    >
      {/* { !triggerGeo ? <MapClickHint longitude={longitude} latitude={latitude} /> : null } */}
      { triggerGeo ? <Me setFollow={setFollow}/> : null }
      <MapPlaces/>
      <Cursor lnglat={cursorPosition}/>
      { children }
    </Map>
    </>
  )
}
