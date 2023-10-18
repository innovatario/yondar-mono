import { Layer, Source } from 'react-map-gl'
import { Position } from 'geojson'
import { useGeolocationData } from '../hooks/useGeolocationData'
import Geohash from 'latlon-geohash'

export const MapGeoChat = ({ zoom, mapLngLat }: { zoom: number; mapLngLat: number[]; }) => {
  const { cursorPosition } = useGeolocationData()

  const lnglat = cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : mapLngLat
  const zoomFactor = Math.ceil((zoom * 0.8)/5*3)
  const hashLength = Math.max(1, Math.min(5, zoomFactor))
  const hash = Geohash.encode(lnglat[1], lnglat[0], hashLength)
  const bounds = Geohash.bounds(hash)
  const boundsArray = [
    [bounds.sw.lon, bounds.sw.lat],
    [bounds.ne.lon, bounds.sw.lat],
    [bounds.ne.lon, bounds.ne.lat],
    [bounds.sw.lon, bounds.ne.lat],
    [bounds.sw.lon, bounds.sw.lat]
  ] as Position[]
  const boundsGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [boundsArray]
    },
    properties: {
      name: `Geochat ${hash}`
    }
  }

  // const offset = pixelsToEms(geohashHeight / 2)
  // console.log(geohashHeight, offset)
  // console.log(zoom,zoomFactor)

  return (
    <Source id="geohash" type="geojson" data={{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [boundsArray] }, properties: boundsGeoJSON.properties }}>
      <Layer
        id="geohash-fill"
        type="fill"
        source="geohash"
        paint={{
          'fill-color': '#7200ff',
          'fill-opacity': 0.1
        }} />
      <Layer
        id="geohash-line"
        type="line"
        source="geohash"
        paint={{
          'line-color': '#4707b1',
          'line-opacity': 0.8,
          'line-width': 2,
        }} />
        <Layer
          id="geohash-text"
          type="symbol"
          source="geohash"
          layout={{
            'text-field': '{name}',
            'text-size': 18,
          }}
          paint={{
            'text-color': '#c6acf3',
            // 'text-translate': [0, geohashHeight / 2 + 12],
          }} />
    </Source>
  )
}
