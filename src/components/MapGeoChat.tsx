import { useMap, Layer, Source } from 'react-map-gl'
import { useGeolocationData } from '../hooks/useGeolocationData'
import Geohash from 'latlon-geohash'
import { pixelDistance } from '../libraries/mapUtils'

export const MapGeoChat = ({ zoom, mapLngLat }: { zoom: number; mapLngLat: number[]; }) => {
  const { cursorPosition } = useGeolocationData()
  const { current: map } = useMap()

  const lnglat = cursorPosition ? [cursorPosition.lng, cursorPosition.lat] : mapLngLat
  const hash = Geohash.encode(lnglat[1], lnglat[0], 5)
  const bounds = Geohash.bounds(hash)
  const boundsArray = [
    [bounds.sw.lon, bounds.sw.lat],
    [bounds.ne.lon, bounds.sw.lat],
    [bounds.ne.lon, bounds.ne.lat],
    [bounds.sw.lon, bounds.ne.lat],
    [bounds.sw.lon, bounds.sw.lat]
  ]
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

  const geohashHeight = pixelDistance(map, bounds.ne.lon, bounds.ne.lat, bounds.ne.lon, bounds.sw.lat)
  // const offset = pixelsToEms(geohashHeight / 2)
  // console.log(geohashHeight, offset)
  console.log(zoom)

  return (
    <Source id="geohash" type="geojson" data={boundsGeoJSON}>
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
      {zoom > 10 ?
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
            'text-translate': zoom < 13 ? [0, geohashHeight / 2] : [0, 0]
          }} />
        :
        null}
    </Source>
  )
}
