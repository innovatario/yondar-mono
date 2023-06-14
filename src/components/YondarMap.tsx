import { useState } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export const YondarMap = () => {
  const [longitude, setLongitude] = useState<number>(-80)
  const [latitude, setLatitude] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  return (
    <Map
      mapboxAccessToken='pk.eyJ1IjoiaW5ub3ZhdGFyIiwiYSI6ImNrZW0wZWwybjAyYnUyeW85bW4za3dtNDUifQ.xa1351lJ3mZH1P9c1fFsGg'
      initialViewState={{
        longitude,
        latitude,
        zoom
      }}
      style={{ width: '100%', height: '50vh', borderRadius: '1rem', marginTop: '1rem' }}
      mapStyle='mapbox://styles/mapbox/streets-v11'
    />
  )
}