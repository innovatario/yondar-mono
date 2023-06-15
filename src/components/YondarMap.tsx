import { useState } from 'react'
import { Me } from './Me'
import Map, { ViewState} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useGeolocationData } from '../providers/GeolocationProvider'
import { FollowTarget } from '../types/Follow'

export const YondarMap = () => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
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

  const mapLongitude = triggerGeo && follow === "USER" ? position?.coords.longitude : longitude
  const mapLatitude = triggerGeo && follow === "USER" ? position?.coords.latitude : latitude

  return (
    <>
    <Map
      mapboxAccessToken='pk.eyJ1IjoiaW5ub3ZhdGFyIiwiYSI6ImNrZW0wZWwybjAyYnUyeW85bW4za3dtNDUifQ.xa1351lJ3mZH1P9c1fFsGg'
      longitude={mapLongitude}
      latitude={mapLatitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '50vh', borderRadius: '1rem', marginTop: '1rem' }}
      onMove={e => setViewState(e.viewState)}
      mapStyle='mapbox://styles/innovatar/ckg6zpegq44ym19pen438iclf'
    >
      { triggerGeo ? <Me setFollow={setFollow}/> : null }
    </Map>
    </>
  )
}