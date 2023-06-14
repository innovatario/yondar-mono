import { useState } from 'react'
import { ViewState} from 'react-map-gl'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export const YondarMap = () => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)

  function setViewState(viewState: ViewState) {
    setLongitude(viewState.longitude)
    setLatitude(viewState.latitude)
    setZoom(viewState.zoom)
  }
  return (
    <Map
      mapboxAccessToken='pk.eyJ1IjoiaW5ub3ZhdGFyIiwiYSI6ImNrZW0wZWwybjAyYnUyeW85bW4za3dtNDUifQ.xa1351lJ3mZH1P9c1fFsGg'
      longitude={longitude}
      latitude={latitude}
      zoom={zoom}
      style={{ maxWidth: '100%', height: '50vh', borderRadius: '1rem', marginTop: '1rem' }}
      onMove={e => setViewState(e.viewState)}
      mapStyle='mapbox://styles/innovatar/ckg6zpegq44ym19pen438iclf'
    />
  )
}