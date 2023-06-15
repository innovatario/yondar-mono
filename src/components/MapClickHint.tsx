import { Marker } from 'react-map-gl'
import '../scss/MapClickHint.scss'

type MapClickHintProps = {
  longitude: number,
  latitude: number,
}

export const MapClickHint: React.FC<MapClickHintProps> = ({longitude, latitude}) => {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor={'center'}>
      <div id="map-hint">
        Click to allow GPS
      </div>
    </Marker>
  )
}